# SmartGrade: Automated Code Review E-Learning System

The SmartGrade system is an **Automated Code Review E-Learning System** designed to enhance coding assessments at universities. It provides **real-time feedback** on C++ and Python code submissions through an **AI-driven approach**. This system aims to reduce grading time, ensure fair and consistent evaluations, and empower students with actionable insights via an intuitive analytics dashboard, ultimately elevating programming education.

## Project Description

The project features a **web-based user interface** coupled with a **machine learning (ML) module** under the hood. This ML module contains a custom-trained **GNN-based neural network** capable of analyzing source code submissions and providing several verdicts, namely:

* Accepted
* Wrong Answer
* Time Limit Exceeded
* Memory Limit Exceeded
* Runtime Error
* Compile Time Error
* Presentation Error

The Web user interface functions as a **role-based platform** for students, teachers, and system administrators.

* **Admins** can create classes under departments and assign students and teachers to these classes.
* **Teachers** can create tests for their classes, view student submissions and the AI-graded results, and add their own final grades and feedback.
* **Students** can register and log in to the system, view tests, their submissions, and both AI-graded and teacher-graded results.

## Tech Stack

The project utilizes a **Laravel + Inertia.js + React** web application. A separate **Flask-based service** hosts the trained GNN module.

* The **backend** uses Laravel models and controllers.
* The **frontend** is built with React pages and TypeScript.

The ML module comprises several components:
* It preprocesses the **statement of the coding problem** and the **Abstract Syntax Tree (AST) form** of the submitted code.
* It creates a **unified vectorized embedding** of these two inputs.
* It then feeds this embedding to the **trained Graph Neural Network** (with its saved weights), which produces predictions for the 7 verdict values.

This entire process is powered by the **PyTorch framework**, leveraging libraries such as `pytorch-geometric`.

> the user facing module is found in the main branch, while the ml module is found in the 'ml-facing-module' branch

## Installation

The web application component of this project can be installed and served locally. The ML module, however, is hosted on **Hugging Face** and exposes a public API.

* **ML Module API Documentation:** [https://documenter.getpostman.com/view/33183582/2sB2qXmP1Z](https://documenter.getpostman.com/view/33183582/2sB2qXmP1Z)
* **ML Module API Endpoint:** [https://eulmelk-neurograde-ml-module.hf.space/](https://eulmelk-neurograde-ml-module.hf.space/)

To install and set up the Laravel-based web app on your machine, ensure you have the following prerequisites:

* **Laravel 12**
* **React 20** (Node.js for npm)
* **PostgreSQL** (preferably version 16)

Once these are installed, follow these steps:

**Step 1: Database Setup**
* Install a PostgreSQL database management application (e.g., pgAdmin, TablePlus, DBeaver) or use command-line tools if you're on Linux.
* Create a new PostgreSQL database, noting down its **name, username, and password**.

**Step 2: Environment File Configuration**
* In the root of the project directory, copy the `.env.example` file and rename the copy to `.env`.

**Step 3: Edit `.env` File**
* Open the newly created `.env` file and update the following lines with your PostgreSQL database credentials:

    ```env
    DB_DATABASE=<your db name>
    DB_USERNAME=<your postgres username>
    DB_PASSWORD=<your db password>
    ```

**Step 4: Initialize the Project**
* Open your terminal or command prompt in the project's root directory and run these commands:

    ```sh
    composer install
    php artisan key:generate
    php artisan migrate
    npm install && npm run build
    ```

**Step 5: Run the Project**
* Execute the following command to start the development server:

    ```sh
    composer run dev
    ```

* You can then access the application in your web browser at: `http://localhost:8000`

## Relevant Files

* The **thesis paper/document** and its **PowerPoint presentation** can be found in the `project_docs/` directory.

**Authors:**
Agumas Desalew, Dechasa Teshome, Elsabet Zeleke, Eshetu Tesema, Eyouel Melkamu. \
**Advised by:** Mr. Yaynshet
Addis Ababa Science And Technology University, College of Engineering, Department of Software Engineering, Section B, 2025.
