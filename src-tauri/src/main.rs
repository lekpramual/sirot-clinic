// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use mysql::*;
use serde::Serialize;


// Define a struct to represent the data you want to send to the frontend
#[derive(Debug, Serialize)]
struct MyData {
    column1: String,
    column2: String,
    // Add other columns as needed
}

#[derive(Debug)]
enum MyError {
    MysqlError(mysql::Error),
    OtherError(String),
}

impl std::fmt::Display for MyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MyError::MysqlError(e) => write!(f, "MySQL error: {}", e),
            MyError::OtherError(e) => write!(f, "Other error: {}", e),
        }
    }
}

impl From<mysql::Error> for MyError {
    fn from(error: mysql::Error) -> Self {
        MyError::MysqlError(error)
    }
}

#[tauri::command]
async fn select_data_from_db() -> Result<Vec<MyData>, MyError> {
    let url = "mysql://root:abc123==@localhost:3306/clinic_db"; // Replace with your MySQL credentials

    // Create a pool of connections
    let pool = Pool::new(url).map_err(MyError::from)?;


    // Get a connection from the pool
    let mut conn = pool.get_conn().map_err(MyError::from)?;

    // Perform a query and fetch the results
    let result: Vec<MyData> = conn.query(
        "SELECT user_id, user_code FROM users"
    ).map_err(MyError::from)?;

    Ok(result)
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![select_data_from_db])
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}
