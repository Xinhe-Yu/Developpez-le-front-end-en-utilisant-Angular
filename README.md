# OlympicGames
The OlympicGames web application is an interactive platform that provides users with information about various countries participating in the Olympics, showcasing their respective Olympic data.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## 1. Installation
Ensure that you have the coorect version of **Angular** (check it with `ng version`) and compatible version of **Node.js** installed (version 16 or higher is recommended for Angular 18, you can check with `node -v`).

After clone the rpository, you can follow the steps to install and run the application:
1. Install dependencies: `npm install`
2. Run the application: `ng serve`
3. Open your browser and navigate to `http://localhost:4200/` to view the application.

## 2. Chosen External Libraries
### [RxJS](https://rxjs.dev/)
- **RxJS** is used for handling asynchronous programming with observables, making it easier to manage data streams and events in your application.
- It provides a powerful way to work with events, asynchronous calls, and data streams.

### [ngx-charts](https://swimlane.gitbook.io/ngx-charts)
- **ngx-charts** is a charting library for Angular applications, providing a variety of chart types and easy-to-use components to visualize data.
- It allows for responsive, interactive charts that can be integrated seamlessly into your application.

## 3. Project Structure
The application structure under the `src/app` directory is organized into three main folders:
1. `models/`

- Contains TypeScript interfaces and classes for defining data types and services for data management.

2. `pages/`

- Holds components used for routing, representing different pages of the application (e.g., Home, Country details).

3. `components/`

- Contains reusable components used throughout the application (e.g., headers, footers, shared UI elements).
