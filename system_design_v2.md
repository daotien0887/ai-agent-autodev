# Hệ Thống AI Multi-Agent Cho Coding Project (Enhanced V2)

Dựa trên kế hoạch ban đầu của bạn, đây là phiên bản nâng cấp chi tiết hơn, tập trung vào tính thực tế, khả năng mở rộng và mô phỏng sát nhất quy trình làm việc của một team dev chuyên nghiệp.

## 1. Kiến Trúc Hệ Thống (System Architecture)

### AI Model Strategy (Ollama + JSON Mode)
Để tối ưu chi phí và bảo mật, hệ thống sẽ sử dụng mô hình lai (Hybrid):
- **Local LLM (via Ollama)**: Sử dụng các model như `llama3.1`, `mistral`, hoặc `deepseek-coder` chạy local.
- **JSON Mode Requirement**: Mọi phản hồi từ local model phải sử dụng **JSON Mode** của Ollama để đảm bảo n8n có thể parse dữ liệu chính xác vào workflow.
- **Cloud LLM (Gemini/GPT-4o)**: Chỉ dùng cho các tác vụ suy luận cực kỳ phức tạp hoặc cần context window lớn.

Thay vì chỉ là các node LLM đơn lẻ, chúng ta sẽ xây dựng một hệ thống **Agentic Workflow** nơi các agent có khả năng sử dụng công cụ (Tools) để tương tác trực tiếp với môi trường phát triển.

### Các "Nhân Sự Ảo" (Agents)

1.  **Product Manager / Architect (Brain)**:
    *   **Model**: Gemini 1.5 Pro (hoặc Claude 3.5 Sonnet) - Cần ngữ cảnh lớn để hiểu toàn bộ codebase.
    *   **Nhiệm vụ**:
        *   Phân tích yêu cầu người dùng.
        *   Sử dụng công cụ `read_file`, `list_dir` để hiểu cấu trúc dự án hiện tại.
        *   Tạo ra file `PLAN.md` chi tiết các bước thực hiện.
    *   **Output**: Danh sách Task dưới dạng JSON.

2.  **Senior Coder (Doer)**:
    *   **Model**: GPT-4o hoặc Claude 3.5 Sonnet (Giỏi coding nhất hiện nay).
    *   **Nhiệm vụ**:
        *   Nhận từng Task từ Architect.
        *   Thực hiện code bằng cách sử dụng công cụ `write_file`, `exec_command`.
        *   Không chỉ output text, Coder sẽ *thực sự sửa file*.
    *   **Tool**: `read_file`, `write_file`, `mkdir`, `list_dir`.

3.  **QA / Tester (Reviewer)**:
    *   **Model**: Local LLM (DeepSeek R1/Llama 3) hoặc GPT-4o-mini (Tiết kiệm chi phí).
    *   **Nhiệm vụ**:
        *   Viết test case dựa trên code mới.
        *   Chạy lệnh test (ví dụ `npm test`).
        *   Phân tích log lỗi và gửi feedback lại cho Coder.

4.  **DevOps (Pipeline)**:
    *   **Model**: GPT-4o-mini.
    *   **Nhiệm vụ**: Quản lý Git, Docker và môi trường.

5.  **Browser Debugger (Eyes)**:
    *   **Model**: GPT-4o-mini (hoặc model hỗ trợ Vision nếu cần phân tích screenshot).
    *   **Nhiệm vụ**:
        *   Khởi chạy trình duyệt (Puppeteer/Playwright).
        *   Kiểm tra lỗi Console (Console Logs, Network Errors).
        *   Chụp ảnh màn hình (Screenshot) khi gặp lỗi giao diện.
        *   Tương tác với UI để tái hiện bug.

6.  **Orchestrator (n8n)**: Điều phối dữ liệu và quản lý vòng lặp sửa lỗi.

---

## 2. Chuẩn Bị Môi Trường (Setup)

### Cấu Trúc Thư Mục
Chúng ta cần setup thư mục để n8n có thể truy cập code của dự án (Shared Volume).

```bash
/Users/long/Documents/Project/MultiAgent/
├── workspace/           # Nơi chứa code dự án thực tế
├── n8n_data/           # Dữ liệu của n8n
├── docker-compose.yml  # File cấu hình
└── tools/              # Các script python/bash hỗ trợ agent
```

### Docker Compose Configuration
Bạn cần mount thư mục workspace vào n8n để Runner có thể đọc/ghi file.

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - ./n8n_data:/home/node/.n8n
      - ./workspace:/data/workspace # Quan trọng: Agent sẽ code ở đây
    environment:
      - GENERIC_TIMEZONE=Asia/Ho_Chi_Minh
      - N8N_SECURE_COOKIE=false
```

---

## 3. Workflow Chi Tiết Trên n8n

### Phase 1: Planning (Kiến trúc sư làm việc)

1.  **Trigger**: Chat Webhook (User nhập: "Thêm tính năng đăng nhập bằng Google").
2.  **Tool - Read Codebase**: Agent Architect dùng tool `run_script` để lấy cấu trúc cây thư mục (tree) và nội dung các file quan trọng.
    *   *Prompt*: "Bạn là Architect. Hãy xem cấu trúc dự án hiện tại và file `package.json`. Phân tích yêu cầu người dùng và lập kế hoạch 5 bước."
3.  **Output Parsing**: Architect trả về JSON Plan.
    ```json
    {
      "files_to_create": ["src/auth/google.strategy.ts", "src/auth/auth.controller.ts"],
      "files_to_edit": ["src/app.module.ts"],
      "step_by_step": ["Cài đặt passport-google", "Tạo strategy", "Đăng ký module"]
    }
    ```

### Phase 2: Execution Loop (Coder & Tester làm việc)

1.  **Split In Batches**: Chia nhỏ Plan thành từng task nhỏ.
2.  **Agent Coder Node**:
    *   **Tools Enable**: `read_file`, `write_file`, `exec_command` (chạy lệnh cài package).
    *   *Prompt*: "Thực hiện bước 1 trong Plan. Hãy viết code chính xác vào file `src/auth/google.strategy.ts`."
3.  **Agent Tester Node**:
    *   *Prompt*: "Viết unit test cho file vừa tạo. Lưu vào `test/auth.spec.ts`."
4.  **Execute Tests Node**: Chạy lệnh `npm test test/auth.spec.ts`.
5.  **Switch (IF Node)**:
    *   **Pass**: Commit code -> Next Task.
    *   **Fail**: Loop lại về **Agent Coder Node** với input là nội dung lỗi (Error Log). Giới hạn max 3 lần retry để tránh vô hạn.

### Phase 3: Web Debugging (Mới)
1.  **Start Dev Server**: Agent chạy lệnh `npm run dev` trong nền.
2.  **Browser Tool**: Sử dụng script Puppeteer để truy cập URL local (ví dụ: `http://localhost:3000`).
3.  **Inspect**:
    *   Lấy Console Logs.
    *   Nếu UI không hiển thị đúng: Chụp ảnh màn hình gửi cho AI phân tích.
4.  **Feedback**: Nếu phát hiện lỗi JS trên trình duyệt, gửi Error Message kèm Stack Trace ngược về cho Coder.

### Phase 4: Deployment (DevOps làm việc)

1.  **Git Operations**:
    *   Thay đổi `git config` user/email.
    *   `git checkout -b feature/login-google`
    *   `git add .`
    *   `git commit -m "feat: add google login"`
    *   `git push origin feature/login-google`
---

## 4. Tối Ưu Hóa & "Senior Level" Features

### 1. RAG cho Codebase (Context Awareness)
Thay vì ném toàn bộ code vào prompt (tốn token), hãy dùng **Vector Store** (Qdrant/Pinecone tích hợp trong n8n).
*   Khi Architect cần tìm hiểu về `AuthService`, nó sẽ query vector DB để lấy chỉ những đoạn code liên quan.

### 2. Structured Output & Validation (JSON Mode)
Dùng tính năng "JSON Mode" của Ollama (hoặc OpenAI API compatible) để đảm bảo Agent không trả về văn bản linh tinh.
*   **Cấu hình Ollama**: Đảm bảo các model được load hỗ trợ `format: json`.
*   **Prompting**: Luôn kết thúc system prompt với yêu cầu trả về JSON schema cụ thể.
*   **Validation**: Sử dụng node IF trong n8n để kiểm tra xem output có phải là JSON hợp lệ hay không trước khi đi tiếp.

### 3. Tool Use (Function Calling)
Đừng bắt Agent viết code ra màn hình chat rồi bạn phải copy-paste. Hãy dạy Agent dùng tool.
Trong n8n, dùng node **"Execute Command"** để tạo các tool đơn giản:
*   `tool_write_file`: Nhận tham số `path`, `content`. Chạy script python để ghi file.
*   `tool_list_dir`: Nhận tham số `path`. Trả về `ls -R`.

### 4. Memory / State
Lưu trạng thái dự án vào file `STATE.json` trong thư mục gốc.
*   Ví dụ: `{"current_task": 2, "failed_attempts": 1, "last_error": "Import not found"}`.
*   Giúp Agent "nhớ" mình đang làm gì nếu workflow bị ngắt quãng.

---

## 5. Next Steps

1.  **Khởi tạo dự án**: Clone repo mẫu hoặc tạo folder `workspace`.
2.  **Cấu hình Docker**: Chạy file `docker-compose.yml` ở trên.
3.  **Thiết lập n8n Credentials**: Add API Key cho OpenAI/Anthropic/Gemini.
4.  **Xây dựng Tool cơ bản**: Viết các script nhỏ để Agent có thể thao tác file system.
