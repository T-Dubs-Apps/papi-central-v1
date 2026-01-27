import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const PapiFreshApp());
}

class PapiFreshApp extends StatelessWidget {
  const PapiFreshApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PAPI Fresh',
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.cyan,
        scaffoldBackgroundColor: const Color(0xFF121212),
        useMaterial3: true,
      ),
      home: const ChatScreen(),
    );
  }
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  // TODO: AFTER DEPLOYING BACKEND, PASTE YOUR RENDER URL HERE
  final String renderUrl = "https://papi-fresh.onrender.com"; 
  
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  bool _isLoading = false;
  String? _activationToken;
  static const String _centralUrl = 'http://localhost:3000'; // change if needed

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({"role": "user", "text": text});
      _isLoading = true;
    });
    _controller.clear();

    try {
      final headers = {"Content-Type": "application/json"};
      if (_activationToken != null) headers['X-Activation-Token'] = _activationToken!;
      final response = await http.post(
        Uri.parse('$renderUrl/chat'),
        headers: headers,
        body: jsonEncode({"text": text}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _messages.add({"role": "papi", "text": data['response']});
        });
      } else {
        setState(() {
          _messages.add({"role": "system", "text": "Server Error: ${response.statusCode}"});
        });
      }
    } catch (e) {
      setState(() {
        _messages.add({"role": "system", "text": "Connection Error: Is the server awake?"});
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _loadActivationToken();
  }

  Future<void> _loadActivationToken() async {
    final prefs = await SharedPreferences.getInstance();
    final t = prefs.getString('activation_token');
    setState(() => _activationToken = t);
    if (t == null) WidgetsBinding.instance.addPostFrameCallback((_) => _showActivationDialog());
  }

  Future<void> _saveActivationToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('activation_token', token);
    setState(() => _activationToken = token);
  }

  Future<void> _showActivationDialog() async {
    final emailController = TextEditingController();
    final appController = TextEditingController(text: 'papi_mobile');

    final ok = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text('Activate App'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Email')),
          TextField(controller: appController, decoration: const InputDecoration(labelText: 'App ID')),
          const SizedBox(height: 8),
          const Text('We will send a one-time code to your email.'),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
          TextButton(
            onPressed: () async {
              final email = emailController.text.trim();
              final app = appController.text.trim();
              if (email.isEmpty) return;
              try {
                final res = await http.post(Uri.parse('$_centralUrl/request-activation'),
                    headers: {'Content-Type': 'application/json'},
                    body: jsonEncode({'email': email, 'app': app}));
                if (res.statusCode == 200) Navigator.of(ctx).pop(true);
                else ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to request code')));
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Network error')));
              }
            },
            child: const Text('Send Code'),
          ),
        ],
      ),
    );

    if (ok == true) {
      final codeController = TextEditingController();
      final email = emailController.text.trim();
      final app = appController.text.trim();
      final got = await showDialog<bool>(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: const Text('Enter Code'),
          content: Column(mainAxisSize: MainAxisSize.min, children: [
            Text('Check $email for the one-time code.'),
            TextField(controller: codeController, decoration: const InputDecoration(labelText: 'Code')),
          ]),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
            TextButton(
              onPressed: () async {
                final code = codeController.text.trim();
                if (code.isEmpty) return;
                try {
                  final res = await http.post(Uri.parse('$_centralUrl/verify-code'),
                      headers: {'Content-Type': 'application/json'},
                      body: jsonEncode({'email': email, 'code': code, 'app': app}));
                  if (res.statusCode == 200) {
                    final body = jsonDecode(res.body as String);
                    final token = body['token'] as String?;
                    if (token != null) {
                      await _saveActivationToken(token);
                      Navigator.of(ctx).pop(true);
                      return;
                    }
                  }
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid code')));
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Network error')));
                }
              },
              child: const Text('Verify'),
            ),
          ],
        ),
      );

      if (got != true) WidgetsBinding.instance.addPostFrameCallback((_) => _showActivationDialog());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("PAPI Fresh"),
        centerTitle: true,
        backgroundColor: Colors.black,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == "user";
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.cyan[900] : Colors.grey[850],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(msg['text']!, style: const TextStyle(color: Colors.white)),
                  ),
                );
              },
            ),
          ),
          if (_isLoading) const LinearProgressIndicator(color: Colors.cyan),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: "Ask PAPI...",
                      filled: true,
                      fillColor: Colors.grey[900],
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.cyan),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}