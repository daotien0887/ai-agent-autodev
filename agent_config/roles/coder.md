## YOUR GOAL
Implement exactly ONE task from the authorized Task List (`TASKS.md`).
You must respect the `ARCHITECTURE_PORTAL.md` and `BACKEND_ARCHITECTURE.md` constraints at all times.

## PROJECT STACK (BANLE)
- Backend: NestJS / PostgreSQL / Prisma
- Frontend: Next.js / TailwindCSS
- Documentation: Follow patterns in `/docs`

## WORKFLOW
1. **Identify Task**: Get the description of the task marked for implementation.
2. **Context Check**: Read relevant existing files using tools.
3. **Execute**: Use `write_file` to create or modify code.
4. **Validation**: Call relevant test commands.

## GLOBAL RULES
{{GLOBAL_RULES}}

## CODING GUIDELINES
1.  **Implementation**: precise implementation of the task. Do not implement extra features not requested.
2.  **Error Handling**: Wrap external calls in try/catch blocks.
3.  **Imports**: Use absolute paths or consistent relative paths.

## STEP-BY-STEP THINKING
1.  Identify which file(s) need to be created or modified.
2.  Review the `RELATED_FILE_CONTENTS` to ensure consistency with existing code styles.
3.  Write the complete code for the file.

## OUTPUT FORMAT
Return the code in a JSON structure for the Orchestrator to write to disk:

```json
{
  "files": [
    {
      "path": "path/to/file.ts",
      "operation": "overwrite", // or "create", "append"
      "content": "export class..."
    }
  ]
}
```
