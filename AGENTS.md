```markdown
# AGENTS.md - AI Coding Agent Guidelines

These guidelines outline the principles and rules for development of AI coding agents within this repository.  Adherence to these principles is crucial for maintaining code quality, testability, and maintainability.

**1. DRY (Don't Repeat Yourself)**

*   All functions, classes, and modules should have a single, clearly defined purpose.
*   Avoid duplication of logic and code across different parts of the codebase.
*   Refactor whenever a function or class performs a similar task; create a new function/class to encapsulate the logic.
*   Use inheritance or composition judiciously, favoring single responsibility principles.

**2. KISS (Keep It Simple, Stupid)**

*   Prioritize readability and clarity over complex or convoluted solutions.
*   Use the simplest possible solution that addresses the problem.
*   Avoid unnecessary abstractions or complexities that don't add value.
*   Keep methods and functions short and focused on a single task.

**3. SOLID Principles**

*   **Single Responsibility Principle:** Each class/module should have one, and only one, reason to change.
*   **Open/Closed Principle:**  The system should be extensible through mechanisms like interfaces and abstract classes, without modifying the existing code.
*   **Liskov Substitution Principle:**  Subclasses must be substitutable for their base classes without altering the correctness of the program.
*   **Interface Segregation Principle:** Clients should not be forced to implement interfaces they do not use.
*   **Dependency Inversion Principle:**  High-level modules should not depend on low-level modules; they should depend on abstractions.

**4. YAGNI (You Aren't Gonna Need It)**

*   Implement only the functionalities required for the current task and subsequent needs.
*   Avoid adding features or logic that are not currently necessary.
*   Refactor and simplify existing code to eliminate unnecessary complexity.

**5. Development Process**

*   **Code Reviews:** All code changes must undergo rigorous code reviews by at least two developers.
*   **Unit Tests:** All code must be thoroughly tested with comprehensive unit tests.  Tests should cover all critical logic and edge cases.
*   **Regression Tests:**  Daily regression tests are required to maintain existing functionality.
*   **Static Analysis:**  Use static analysis tools (e.g., pylint, eslint) to identify potential issues and enforce coding standards.
*   **Documentation:**  Provide clear and concise documentation for all functions, classes, and modules, adhering to established documentation conventions.
*   **Error Handling:** Implement robust error handling and logging to provide meaningful feedback and prevent unexpected behavior.
*   **Version Control:** Use Git with a well-defined branching strategy (e.g., feature branches, releases).

**6. Code Size Limits**

*   Maximum code size: 180 lines.
*   Code must be easily readable and understandable.

**7. Test Coverage Requirements**

*   Minimum test coverage: 85%
*   Testing methodology:  Automated tests focusing on critical paths and edge cases.
*   Test data strategy:  Realistic and diverse test data.

**8. File Structure**

*   Each file must have a single, focused purpose.
*   File names should be descriptive and follow a consistent naming convention.
*   Comments should clearly explain complex logic or non-obvious code.
*   Use appropriate indentation and formatting for readability.

**9. Specific Requirements**

*   All code must adhere to the established coding style guide.
*   Implement appropriate data validation and error handling mechanisms.
*   Include logging statements to track events and debugging information.
*   Consider using appropriate data structures and algorithms for performance optimization.
*   Provide clear documentation about API usage and expected inputs/outputs.

**10.  AI Agent Considerations**

*   Code must be designed to be easily adaptable for future AI models.
*   Consider the potential impact of the code on AI training and inference.
*   Utilize clear and understandable code patterns for AI agent processing.

**11.  Tools**

*   Use [Specific IDE/Editor] for code editing and debugging.
*   Employ [Specific Testing Framework] for automated testing.
*   Utilize [Specific Static Analysis Tool] for code quality checks.

These guidelines are intended to serve as a framework for development.  They are subject to change as the project evolves.  Developers are expected to consistently apply these principles throughout the lifetime of the project.
```