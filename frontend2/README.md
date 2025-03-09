## Setup & Usage

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/TRACKit-CS253/TRACKit.git
    ```

2. Navigate to the frontend folder and install the required packages:
    ```sh
    cd TRACKit/frontend2
    npm install
    ```

3. Start the development server:
    ```sh
    npm start
    ```
   The project will be available at [http://localhost:3000](http://localhost:3000).

## Available Routes

After starting the server, you can navigate to the following routes:

- **Login Page:**  
  Visit [http://localhost:3000/login](http://localhost:3000/login) to see the login screen.

- **Admin Dashboard:**  
  Visit [http://localhost:3000/admin](http://localhost:3000/admin) for the admin interface.

- **User Dashboard:**  
  Visit [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to access the main user dashboard.  
  Within the dashboard, you have navigation links provided by the side menu:
  - **My Courses:** [http://localhost:3000/dashboard/courses](http://localhost:3000/dashboard/courses)
  - **Performance:** [http://localhost:3000/dashboard/performance](http://localhost:3000/dashboard/performance)
  - **Profile:** [http://localhost:3000/dashboard/profile](http://localhost:3000/dashboard/profile)
  - **Contact Us:** [http://localhost:3000/dashboard/contactus](http://localhost:3000/dashboard/contactus)

## Development

- **React Components & Routing:**  
  The project uses React Router. The main routes are configured in `App.jsx` and nested routes are set in the `Dashboard.jsx`. The `DashBoardMenu` component provides navigation using `NavLink`.

- **Styling:**  
  The project is styled with Tailwind CSS. Modify styles directly in the component files or add custom CSS files as needed.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, feel free to open an issue or submit a pull request.

Happy coding!