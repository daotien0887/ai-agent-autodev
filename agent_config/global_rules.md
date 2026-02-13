# GLOBAL CODING RULES & STANDARDS

## 1. General Principles
- **DRY (Don't Repeat Yourself)**: Avoid code duplication. Extract logic into reusable functions/components.
- **KISS (Keep It Simple, Stupid)**: Write simple, readable code over complex "clever" solutions.
- **SOLID**: Adhere to SOLID principles for object-oriented design.

## 2. Security (CRITICAL)
- **No Hardcoded Secrets**: NEVER put API keys, passwords, or tokens directly in the code. Use environment variables.
- **Input Validation**: Always validate user input at the API boundary.

## 3. Tech Stack Constraints
- **Backend**: Node.js (NestJS).
- **Frontend**: React PWA (Next.js) with TailwindCSS.
- **Testing**: Jest.
- **AI Infrastructure**: Ollama (Local) for fast/cheap tasks, Gemini/GPT-4o for complex reasoning.

## 4. AI Interaction & JSON Standards (CRITICAL)
- **JSON Mode**: Tất cả Agent PHẢI trả về dữ liệu định dạng JSON hợp lệ.
- **Strict Format**: Khi sử dụng Ollama, phải kích hoạt tham số `format: "json"`.
- **Web Debugging Standard**: Khi xảy ra lỗi UI, Agent phải cung cấp Console Logs hoặc Screenshot để làm bằng chứng sửa lỗi.
- **Schema Validation**: Mỗi JSON response phải tuân thủ đúng schema được định nghĩa trong role-specific prompt.

## 5. Documentation
- Add JSDoc/Docstring to all exported functions and classes.
- Explain *why* complex logic exists, not just *what* it does.
