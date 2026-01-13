# Inquiry Kanban Board

visit - https://inquiry-kanban-board-nvbt.vercel.app/

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/DavitGe/Inquiry-Kanban-Board.git
    cd Inquiry-Kanban-Board
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure Overview

The project follows a modular structure to ensure scalability and maintainability:

- `src/app/`: Next.js App Router.
  - `api/`: Backend API endpoints.
- `src/components/`:
  - `features/`: Feature-specific components.
  - `ui/`: Reusable components.
- `src/context/`: Context providers.
- `src/interfaces/`: Typescript definitions.
- `src/mocks/`: Mock data.
- `src/utils/`: Helper functions.

## Libraries Used and Why

I prefer not to use many libraries, when choosing one of them i choose low level ones to have flexibility and develop exact same way as planned.

| Library          | Purpose       | Why?                                                                       |
| :--------------- | :------------ | :------------------------------------------------------------------------- |
| **@dnd-kit**     | Drag and Drop | 1. Its well documented. 2. You fully control UI. 3. Supports complex tasks |
| **Lucide React** | Icons         | Light library for icons. I like their simple style                         |
