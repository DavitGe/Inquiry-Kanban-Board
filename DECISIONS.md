# Architecture & Design Decisions

## 1. Drag-and-Drop Approach

**Decision:** Using `@dnd-kit` (specifically `@dnd-kit/core` and `@dnd-kit/sortable`).

**Why this approach?**

- _I tried several libraries for creating kanban boards earlier, I had best experience with react-beautiful-dnd (because of their templates base, it was quite easy and fast to use them) but at the moment they don't have updates also another libraries weren't as light as dnd-kit. that library is very flexible and gives you ability to create your UI and also has very great modular architecture, You can instal its only that modules that you are using._

**Implementation Details:**

- Structured with a generic `KanbanBoard` component to handle the complex drag-and-drop logic (sensors, collision detection, cross-column movement).
- Used `DragOverlay` for smoother visual feedback during drag.
- Optimistic UI updates are handled in `handleDragOver` and `handleDragEnd`.

---

## 2. State Management

**Decision:** React Context API (`InquiryProvider`).

**Why this approach?**

- _It’s built in and keeps the architecture simple without installing unnecessary dependencies._

---

## 3. UX Decisions & Alternatives

**User Experience Choices:**

- **Visual Feedback:**
  - Clear loading states and error messages using a custom Message system.
  - Responsive layout for different screen sizes.
  - Simple/Minimalistic style

**Alternatives Considered:**

_I intentionally chose an minimal design because ERP users value clarity, speed, and predictability over visual experimentation. so here we can see:_

1. _Whole Kanban board is in user's screen, so its easy for user to scroll through one column - without scrolling another one._
2. _Each column has its collapser, (more efffective on smaller screen sizes) when user wants to keep track of one or several columns he don't need to scroll(horizontally) see another elements._
3. _Indicators when potential value is more then 50.000$ are eyecatching but simple, it don't overloads website keeps it minimalistic but gets atttention at the same time._
4. _drag and drop function has its overlayRender, so user sees where he's droping element and function is intuitive_
5. _Every element has its error/success messages and loading so its easy for user get informed, what's happening right now_

---

## 4. Future Improvements

If given more time, the following enhancements would be prioritized:

- **Persistence:** Implementation of a persistent database (currently using mock data/local API).
- **Testing:** Comprehensive unit and integration tests for drag-and-drop edge cases.
- **Real-time Updates:** Using WebSockets or Server-Sent Events to reflect changes from other users instantly.
- **Performance:** Further optimization for boards with big data (e.g. Virtualization).
