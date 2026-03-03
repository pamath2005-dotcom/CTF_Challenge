# 🔓 Broken Lock - Web Vulnerability Learning Platform

## 📌 Overview

Broken Lock is an interactive Capture The Flag (CTF) style web application designed to demonstrate real-world web vulnerabilities based on the OWASP Top 10.

This project is strictly for educational purposes and must only be run in a local environment.

---

## 🎯 Features

- **10 Vulnerability Levels**: A progressive learning path covering common web exploits.
- **Scoring System**: Keep track of your progress as you solve challenges.
- **Hacker Terminal Animation**: Immersive UI elements for a better CTF experience.
- **Real Backend SQL Injection Demo**: Hands-on experience with actual database vulnerabilities.
- **Session Handling**: Practice and understand session-related exploits.
- **SQLite Database**: Lightweight, file-based database integration.
- **Node.js Backend**: Robust server-side architecture.
- **XAMPP Compatible**: Can optionally be run with PHP/Apache.

---

## 🧱 Vulnerability Levels

1. **Information Exposure**: Find hidden data and secrets exposed on the client side.
2. **Client-Side Validation Bypass**: Learn how UI restrictions can be bypassed by intercepting and manipulating requests.
3. **Cookie Manipulation**: Tamper with session or state cookies to gain unauthorized elevated access.
4. **SQL Injection (Simulated & Real)**: Exploit poorly sanitized database queries to extract, modify, or delete information.
5. **Cross-Site Scripting (XSS)**: Inject and execute malicious scripts within a victim's browser session.
6. **Insecure Direct Object References (IDOR)**: Access restricted objects or profiles by manipulating identifiers, such as the `user_id` parameter.
7. **Path Traversal**: Manipulate file paths to access directories and files outside the intended web root.
8. **Token Tampering / Insecure Deserialization**: Modify JSON Web Tokens (JWT) or serialized data to bypass authentication and elevate privileges.
9. **Command Injection**: Append extra system commands to backend execution contexts to execute arbitrary logic.
10. **Server-Side Request Forgery (SSRF)**: Force the server to make requests to internal or unintended external resources.

---

## 🛠 Technology Stack

**Frontend:**
- HTML5
- CSS3
- vanilla JavaScript

**Backend:**
- Node.js
- Express.js
- SQLite (for simulated/real backend exploits)

**Server:**
- Localhost (Node.js)
- XAMPP (Optional for PHP-based challenges)

---

## 🚀 Installation & Setup (Node.js Version)

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v14 or newer recommended)
- Git (optional, for cloning)

### Steps

1. **Clone the repository (or download the ZIP):**
   ```bash
   git clone <your-repository-url>
   cd broken-lock
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   node server.js
   # or 'npm start' if defined in package.json
   ```

4. **Access the application:**
   Open your preferred web browser and navigate to:
   ```text
   http://localhost:3000
   ```
   *(Port may vary based on your backend configuration)*

---

## 🏆 Scoring System

- **Points**: Points are assigned per level upon successful exploitation and flag capture.
- **Storage**: Currently stored in `LocalStorage` (Frontend) for ease of use.
- **Extensibility**: The system can be extended to use database storage for persistent, multi-user tracking.

---

## ⚠ Disclaimer / Warning

🚨 **This application is intentionally vulnerable and designed for educational purposes only.** 🚨

**Do NOT:**
- Host this application publicly on the internet.
- Use any of this code in production environments.
- Connect it to real-world or sensitive systems.

*The author is not responsible for any misuse of the information or code provided in this project.*

---

## 📚 Educational Standards

- Based on the [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/).
- Designed and intended to teach Defensive Programming and Ethical Hacking Principles.

---

## 👨‍💻 Author

**Final Year BICT Cybersecurity Project**

---

## 🎮 How to Play

1. **Start the Application**: Ensure your local server is running (see [Installation](#-installation--setup-nodejs-version)).
2. **Navigate the Levels**: Start with Level 1 and progress sequentially. Each level presents a distinct web vulnerability.
3. **Find the Flag**: Your goal in each level is to exploit the vulnerability to uncover a hidden "flag" or achieve a specific objective (like accessing an admin profile).
4. **Submit the Flag**: Enter the flag into the submission form. Correct flags award points and unlock the next level.
5. **Learn**: Read the provided hints and explanations if you get stuck. Each level is designed to teach a specific concept.

---

## 🧰 Tools Required

To successfully complete the challenges in Broken Lock, it is recommended to have the following tools:

- **A Modern Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge.
- **Browser Developer Tools**: Built-in tools for inspecting HTML, monitoring network requests, and viewing stored cookies/local storage.
- **Web Proxy (Optional but Recommended)**: Tools like [Burp Suite Community Edition](https://portswigger.net/burp/communitydownload) or [OWASP ZAP](https://www.zaproxy.org/) for intercepting and modifying HTTP requests.
- **SQLite Browser (Optional)**: For inspecting the backend database directly when exploring SQL Injection.

---

## 📁 Project Structure (Expected)

```text
broken-lock/
├── public/               # Frontend assets (CSS, JS, Images)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── index.html        # Main landing page
├── levels/               # Individual vulnerability challenges
│   ├── level1.html       # Information Exposure
│   ├── level2.html       # Client-side bypass
│   └── ...
├── server/               # Backend logic
│   ├── server.js         # Node.js/Express application entry
│   └── database.sqlite   # Local database (created at runtime)
├── package.json          # Node.js dependencies
└── README.md             # Project documentation
```

---

## 🤝 Contributing

This project is open for educational contributions! If you have ideas for new levels, bug fixes, or UI improvements:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-level`).
3. Commit your changes (`git commit -m 'Add Level 7: CSRF'`).
4. Push to the branch (`git push origin feature/new-level`).
5. Open a Pull Request.

## 🔍 Walkthroughs & Hints

Stuck on a level? The point of Broken Lock is to learn!

- **Look around**: Press `F12` to open Developer Tools. Check the Elements, Console, Network, and Application tabs.
- **Read carefully**: The descriptions and "hints" provided on each level page usually point directly to the vulnerability.
- **Think like an attacker**: How would you break the logic if you didn't have to follow the rules of the UI?
- *Note: Official step-by-step walkthroughs are purposely excluded from this repository to encourage hands-on learning.*

---

## 🛠️ Troubleshooting

- **Server won't start (`EADDRINUSE`)**: Another process might be using port `3000`. Open `server.js` and change the port, or kill the background process using the port.
- **Levels aren't working / DB errors**: Ensure the `server/` directory is writable so the application can create `database.sqlite` at runtime.
- **Cookies/LocalStorage not resetting**: Use your browser's Developer Tools (Application > Storage) to manually clear Site Data if the "Reset Progress" button fails.

---

## 🙏 Acknowledgments & Credits

- The **OWASP Foundation** for providing industry-standard documentation and resources on web security.
- Inspiration drawn from classic CTF platforms like *DVWA*, *Juice Shop*, and *WebGoat*.
- UI components and hacker aesthetic inspired by classic cyberpunk terminal interfaces.

## 🗺️ Future Roadmap

Planned updates and new vulnerabilities for future versions of Broken Lock:

- **Level 11: Cross-Site Request Forgery (CSRF)** - Exploiting state-changing requests on behalf of an authenticated user.
- **Level 12: XML External Entities (XXE)** - Parsing maliciously crafted XML documents to extract internal files.
- **Level 13: Security Misconfiguration** - Finding exposed admin panels, verbose error messages, or default credentials.
- **Global Leaderboard**: Implementing a backend Redis/PostgreSQL database to track scores across multiple users.
- **Dockerization**: Providing a `docker-compose.yml` for even easier setup and isolated execution.

---

## ❓ FAQ

**Q: Can I use automated tools like SQLMap or DirBuster against this?**  
A: Yes, since it's running locally on your own machine, you can test out automated vulnerability scanners. However, manual exploitation is recommended first for better learning.

**Q: Why is my browser blocking the XSS payload?**  
A: Modern browsers have built-in XSS filters. You might need to test your XSS payloads on the specific vulnerable endpoints designed within the application, or temporarily disable browser protections (not recommended for daily browsing).

**Q: Is there a PHP version of this?**  
A: The core application is Node.js, but a separate branch/folder might contain XAMPP/PHP equivalents for specific levels where PHP syntax makes the vulnerability easier to demonstrate (like `include()` vulnerabilities). Check the repository branches.

## 🛡️ Remediation & Mitigations

While *Broken Lock* focuses on exploitation, understanding how to secure these applications is the ultimate goal. For each vulnerability, the project provides learning materials on how to mitigate them:

1. **Information Exposure**: Never output sensitive debug information in production. Restrict who can view configuration files.
2. **Client-Side Validation Bypass**: Always perform validation on the **Server Side**. Client-side checks are for user experience, not security.
3. **Cookie Manipulation**: Use secure, randomly generated session IDs. Sign cookies (e.g., JWT) to prevent tampering.
4. **SQL Injection**: Use **Prepared Statements (Parameterized Queries)**. Never concatenate user input directly into SQL strings.
5. **Cross-Site Scripting (XSS)**: **Sanitize** and **Encode** all user input before rendering it in the browser. Use Content Security Policies (CSP).
6. **IDOR**: Implement robust **Access Control Checks**. Just because a user knows an ID doesn't mean they are authorized to view that object.
7. **Path Traversal**: Validate and sanitize file paths against directory traversal characters (`../`). Better yet, use whitelisted identifiers instead of direct file paths.
8. **Token Tampering**: Cryptographically sign tokens using strong, modern algorithms and keep the Secret Key securely on the server. Always validate the signature on every request.
9. **Command Injection**: Avoid calling OS commands directly whenever possible. If unavoidable, use built-in APIs that do not spawn a shell, or strictly sanitize and whitelist inputs.
10. **SSRF**: Validate all user-supplied URLs. Use an allowlist for permitted destinations and disable the fetching of local (`127.0.0.1`), internal IP addresses, and sensitive wrappers (like `file://`).

---

## 📸 Screenshots

- **Main Dashboard / Terminal**
  `![Dashboard Placeholder](public/images/dashboard-placeholder.png)`

- **SQL Injection Example Level**
  `![SQLi Placeholder](public/images/sqli-placeholder.png)`

- **Level Completion / Flag Captured**
  `![Flag Placeholder](public/images/flag-placeholder.png)`

---

## 👥 Code of Conduct

As an educational repository, we expect all users and contributors to act ethically.

- Focus on learning and defensive security.
- Do not use these techniques against systems you do not own or do not have explicit permission to test.
- Be respectful when raising issues or collaborating on the codebase.

---

## 📌 License

**Educational Use Only**. Not intended for commercial use or public deployment.