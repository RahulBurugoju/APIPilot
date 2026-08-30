# APIPilot Project Coding Style & Architecture Guidelines

This file defines the coding style, conventions, and architectural patterns for the **APIPilot** repository. All code contributions must strictly adhere to these standards.

---

## 1. Backend / Server Conventions (`server/`)

### 1.1 Formatting & Indentation
- **Indentation**: 4 spaces strictly for JavaScript/Node.js files.
- **Quotes**: Double quotes (`"..."`) for strings, object keys where needed, and module imports.
- **Semicolons**: Mandatory semicolons `;` at the end of statements.
- **Trailing Commas**: Mandatory trailing commas in multi-line objects, arrays, parameter lists, and schemas.
- **Vertical Spacing**: Generous vertical whitespace. Separate distinct schema properties, logic blocks, and statement groups with blank lines for readability.

### 1.2 Mongoose Models (`server/src/models/`)
- Sub-schemas must be defined explicitly as separate schema instances with `{ _id: false }` before the root schema:
  ```javascript
  const childSnapshotSchema = new mongoose.Schema(
      {
          key: {
              type: String,
              trim: true,
          },

          value: {
              type: String,
              default: "",
          },

          enabled: {
              type: Boolean,
              default: true,
          },
      },
      {
          _id: false,
      }
  );
  ```
- Use 4-space indent for schema fields with blank lines separating each field definition.
- Always include `{ timestamps: true }` in persistent schemas.
- File naming: `PascalCase.model.js` or `camelCase.model.js`.
- Export pattern:
  ```javascript
  const ModelName = mongoose.model(
      "ModelName",
      modelNameSchema
  );

  export default ModelName;
  ```

### 1.3 Controller & Service Architecture
- **Async Handling**: Always wrap controller methods in `asyncHandler`.
- **Error Handling**: Throw centralized `ApiError(statusCode, message)`.
- **Response Format**: Send responses using `new ApiResponse(statusCode, data, message)`.
- **Validation**: Enforce request schemas in `validators/` using Zod schemas with custom error messages and regex matchers.

---

## 2. Frontend / Client Conventions (`client/`)

### 2.1 Formatting & Structure
- **Indentation**: 2 spaces for React JSX/JS files.
- **Quotes**: Double quotes (`"..."`) for JSX attributes and imports.
- **State Management**:
  - Redux Toolkit slices (`featureSlice.js`) and thunks (`feature.thunk.js`) organized in `src/features/<feature>/`.
  - Do NOT create duplicate files just for re-exporting.
  - Singular reducer naming in `store.js` (`auth`, `project`, `collection`, `request`, `environment`).
- **Component Design**:
  - Keep components modular, focused, and clean.
  - No placeholder code or generic fallback text; build complete, functional UI.

### 2.2 Design System & Visual Aesthetics
- **Theme Support**: Seamless light and dark mode classes (`dark:...`).
- **Color Palette**:
  - Warm sand backgrounds: `bg-[#FAF3E1]`, `bg-[#FFFFFF]` (light) / `bg-[#101012]`, `bg-[#141416]`, `bg-[#1C1C1F]` (dark)
  - Borders: `border-[#E6D2A5]` (light) / `border-[#1F1F23]`, `border-[#2C2C2E]` (dark)
  - Primary / Accent Orange: `#FF6D1F`, `#E85B0F`
  - Text: `#222222` (light text), `#F5F5F7` (dark text), `#5C5C5C` / `#8C8C8C` / `#A1A1A6` (secondary/muted)
- **HTTP Method Badges**:
  - `GET`: Green (`#059669` / `#00E599`)
  - `POST`: Amber (`#D97706` / `#FBBF24`)
  - `PUT`: Blue (`#2563EB` / `#60A5FA`)
  - `PATCH`: Purple (`#7C3AED` / `#A78BFA`)
  - `DELETE`: Red (`#DC2626` / `#F87171`)
