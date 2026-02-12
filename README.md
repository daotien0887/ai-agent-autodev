# 🤖 AI Multi-Agent AutoDev System (V2)

Hệ thống phát triển phần mềm tự động sử dụng kiến trúc Multi-Agent (Đa tác tử), điều phối bởi n8n và hỗ trợ mô hình Hybrid AI (Ollama + Cloud LLM).

## 🚀 Tổng quan hệ thống
Đây không chỉ là một công cụ chat với AI, mà là một **Agentic Workflow** hoàn chỉnh. Hệ thống có khả năng tự hiểu yêu cầu, lập kế hoạch, viết code, tự kiểm thử và tự sửa lỗi (Self-Healing) trực tiếp trên trình duyệt.

## 🏗️ Kiến trúc Multi-Agent
Hệ thống bao gồm các "nhân sự ảo" chuyên biệt:

- **Architect (Brain)**: Phân tích dự án, lập kế hoạch 5 bước lưu dưới dạng JSON Plan.
- **Senior Coder (Doer)**: Thực thi code trực tiếp vào file system (`write_file`).
- **QA/Tester (Reviewer)**: Viết unit test và chạy kiểm thử tự động.
- **Browser Debugger (Eyes)**: Khởi chạy Puppeteer để bắt lỗi Console và chụp ảnh màn hình UI.
- **DevOps (Pipeline)**: Quản lý Git Flow và Deployment.
- **n8n (Orchestrator)**: Quản lý trạng thái và vòng lặp phản hồi.

## 🛠️ Tech Stack
- **Core Orchestration**: [n8n](https://n8n.io/)
- **AI Models**: 
  - Local: **Ollama** (Llama 3.1 / DeepSeek) cho các tác vụ nhanh/tiết kiệm.
  - Cloud: **Gemini 1.5 Pro / GPT-4o** cho tư duy kiến trúc.
- **Backend/Frontend**: Node.js (NestJS), Next.js (PWA), TailwindCSS.
- **Automation Tools**: Puppeteer (Web Debugging), Jest (Unit Testing).
- **Communication Protocol**: JSON Mode (Cấu trúc dữ liệu nghiêm ngặt).

## 🔄 Vòng lặp phát triển (Workflow)
1. **User Trigger**: Nhập yêu cầu qua Chat/Webhook.
2. **Planning**: Architect quét toàn bộ codebase và tạo Plan.
3. **Execution Loop**: 
   - Coder viết mã nguồn.
   - Tester chạy unit test.
   - **Debugger** kiểm tra lỗi hiển thị trên trình duyệt.
   - Nếu lỗi → AI tự động đọc log và sửa lại (Self-Correction).
4. **Push**: Hoàn tất task và đẩy lên GitHub via `gh cli`.

## ⚙️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Docker & Docker Compose
- Node.js & npm
- [Ollama](https://ollama.com/) (Chạy local mô hình Llama3 hoặc DeepSeek)
- [GitHub CLI (gh)](https://cli.github.com/)

### 2. Khởi chạy n8n với Docker
```bash
docker run -it --rm --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd)/workspace:/data/workspace \
  n8nio/n8n
```

### 3. Cài đặt công cụ Debug
```bash
npm install puppeteer
```

## 📈 Tính năng "Senior Level" nổi bật
- **Hybrid AI Model**: Ưu tiên xử lý local để bảo mật dữ liệu và tiết kiệm chi phí.
- **JSON Mode Strict**: Đảm bảo mọi giao tiếp giữa Agent và Workflow chính xác 100%.
- **Vision-based Debugging**: Có khả năng chụp ảnh màn hình và phân tích lỗi giao diện.
- **Shared Workspace**: Các Agent thực sự thao tác trên cùng một folder code như một team Dev người thật.

---
*Dự án được phát triển nhằm mô phỏng quy trình phần mềm chuyên nghiệp sử dụng sức mạnh của Agentic AI.*
