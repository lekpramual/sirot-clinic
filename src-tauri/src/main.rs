// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use mysql::*;
// use mysql::prelude::*;

use mysql::*;
use mysql::prelude::*;
use tauri::command;
use md5;


// Define a struct to hold the query result.
// #[derive(Debug, serde::{Serialize,Deserialize})]
#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct User {
    user_id: u32,
    user_code: String,
    user_fullname: String,
    user_position:String,
    user_status:String
}

#[derive(Debug, serde::Serialize, serde::Deserialize, FromRow)]
struct UserByID {
    user_id: u32,
    user_code: String,
    user_title:String,
    user_fname:String,
    user_lname:String,
    user_position:String,
    user_status:String,
    user_username:String
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct Patient {
    hn: String,
    name: String,
    tel: String,
    last_date:String
}

#[derive(Debug, serde::Serialize, serde::Deserialize, FromRow)]
struct PatientById {
    patient_hn: String,
    patient_title: String,
    patient_fname: String,
    patient_lname: String,
    patient_tel: String,
    patient_cid:String,
    patient_addr:String
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct PhistoryById {
  phistory_date: String,
  phistory_time: String,
  phistory_name: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct ReportByDate {
  hn: String,
  name: String,
  tel: String,
  date: String,
  time: String
}


// type user_code = String;

#[command]
async fn create_and_update_item(
  user_title:String,
  user_fname:String,
  user_lname:String,
  user_position:String,
  user_username:String,
  user_password:String
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

    // Create an MD5 hash of the password
    let hash = md5::compute(user_password);
    // Convert the hash to a hex string and return it
    let _hashPassword = format!("{:x}", hash);

    let _user = match conn.exec_drop(
        "INSERT INTO users (user_title, user_fname, user_lname,user_position,user_username,user_password, user_created, user_updated)
         VALUES (:user_title, :user_fname, :user_lname, :user_position, :user_username, :user_password , NOW(), NOW())",
        params! {
            "user_title" => user_title,
            "user_fname" => user_fname,
            "user_lname" => user_lname,
            "user_position" => user_position,
            "user_username" => user_username,
            "user_password" => _hashPassword
        }
    ){
        Ok(_user) => _user,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };



    // Retrieve the last inserted ID
    let last_id = conn.last_insert_id();

    let slip_number = format!("{:04}", last_id);
    let _slip_number = "EMP-".to_owned()+&slip_number;
    let userUpdate = match  conn.exec_drop(
      "UPDATE users SET user_code = :user_code WHERE user_id = :id",
        params! {
            "user_code" => _slip_number,
            "id" => last_id,
        }
    ){
      Ok(userUpdate) => userUpdate,
      Err(err) => return Err(format!("Failed to execute update query: {}", err)),
  };

    println!("Last insert ID: {}", last_id);
     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn connect_to_mysql() -> Result<Pool, String> {
    let database_url = "mysql://root:abc123==@localhost:3306/clinic_db";

    let pool = match Pool::new(database_url) {
        Ok(pool) => pool,
        Err(err) => return Err(format!("Failed to create database pool: {}", err)),
    };



    // let mut conn = match pool.get_conn() {
    //     Ok(conn) => conn,
    //     Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    // };


    // match conn.query_drop("SELECT 1") {
    //     Ok(_) => Ok("Connection successful!".to_string()),
    //     Err(err) => Err(format!("Query failed: {}", err)),
    // }

    Ok(pool)
}

#[command]
async fn read_users() -> Result<Vec<User>, String> {
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };


    // Perform a SELECT query.
    let users: Vec<User> = match conn.query_map(
      "SELECT user_id, user_code, CONCAT(user_title,user_fname,' ',user_lname) AS user_fullname,user_position,user_status FROM users",
      |(user_id, user_code, user_fullname, user_position,user_status)| User { user_id, user_code, user_fullname, user_position,user_status },
    ) {
        Ok(users) => users,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    Ok(users)
}


#[command]
async fn read_user_id(user_id: u32) -> Result<Option<UserByID>,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

    let user: Option<UserByID> = match conn.exec_first(
        "SELECT user_id,user_code,user_title,user_fname,user_lname,user_position,user_status,user_username FROM users WHERE user_id = :user_id",
        params! {
            "user_id" => user_id,
        }
    ){
              Ok(user) => user,
              Err(err) => return Err(format!("Failed to execute query: {}", err)),
          };

    Ok(user)
}

#[command]
async fn update_user_id(
  user_id:u32,
  user_title:String,
  user_fname:String,
  user_lname:String,
  user_position:String,
  user_username:String,
  user_password:String
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

    if(user_password != ""){
       // Create an MD5 hash of the password
      let hash = md5::compute(user_password);
      // Convert the hash to a hex string and return it
      let _hashPassword = format!("{:x}", hash);

      let userUpdate = match  conn.exec_drop(
        "UPDATE users SET
          user_title = :user_title,
          user_fname = :user_fname,
          user_lname = :user_lname,
          user_position = :user_position,
          user_username = :user_username,
          user_password = :user_password,
          user_updated = NOW()
          WHERE user_id = :user_id",
          params! {
            "user_title" => user_title,
            "user_fname" => user_fname,
            "user_lname" => user_lname,
            "user_position" => user_position,
            "user_username" => user_username,
            "user_password" => _hashPassword,
            "user_id" => user_id
          }
      ){
        Ok(userUpdate) => userUpdate,
        Err(err) => return Err(format!("Failed to execute update query: {}", err)),
      };
    }else{
      let userUpdate = match  conn.exec_drop(
        "UPDATE users SET
          user_title = :user_title,
          user_fname = :user_fname,
          user_lname = :user_lname,
          user_position = :user_position,
          user_username = :user_username,
          user_updated = NOW()
          WHERE user_id = :user_id",
          params! {
            "user_title" => user_title,
            "user_fname" => user_fname,
            "user_lname" => user_lname,
            "user_position" => user_position,
            "user_username" => user_username,
            "user_id" => user_id
          }
      ){
        Ok(userUpdate) => userUpdate,
        Err(err) => return Err(format!("Failed to execute update query: {}", err)),
      };
    }



    // println!("Last insert ID: {}", user_id);
     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn login_user(user_username: String, user_password: String) -> Result<u32,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

     // Create an MD5 hash of the password
     let hash = md5::compute(user_password);
     // Convert the hash to a hex string and return it
     let _hashPassword = format!("{:x}", hash);

    let user: Option<(u32, String, String)> = match conn.exec_first(
        "SELECT user_id,user_username,user_password FROM users WHERE user_username = :user_username  AND user_password = :user_password AND user_status ='active' ",
        params! {
            "user_username" => user_username,
            "user_password" => _hashPassword
        }
    ){
              Ok(user) => user,
              Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    // Check if the user exists
    if let Some((user_id, user_username, user_password)) = user {
      Ok(user_id.into())
    } else {
        Err("Invalid username or password".into())
    }
}

#[command]
async fn login_user_bk(user_username: String, user_password: String) -> Result<String,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

     // Create an MD5 hash of the password
     let hash = md5::compute(user_password);
     // Convert the hash to a hex string and return it
     let _hashPassword = format!("{:x}", hash);

    let user: Option<(u32, String, String)> = match conn.exec_first(
        "SELECT user_id,user_username,user_password FROM users WHERE user_username = :user_username  AND user_password = :user_password AND user_status ='active' ",
        params! {
            "user_username" => user_username,
            "user_password" => _hashPassword
        }
    ){
              Ok(user) => user,
              Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    // Check if the user exists
    if let Some((user_id, user_username, user_password)) = user {
      Ok("success".into())
    } else {
        Err("Invalid username or password".into())
    }
}


// -- ----------------------------
// -- EndPoint for patient
// -- ----------------------------
#[command]
async fn create_and_update_patient(
  patient_title:String,
  patient_fname:String,
  patient_lname:String,
  patient_tel:String,
  patient_cid:String,
  patient_addr:String,
  user_id:u32,
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

    let _patient = match conn.exec_drop(
        "INSERT INTO patient (patient_title, patient_fname, patient_lname,patient_tel,patient_cid,patient_addr, patient_created, patient_updated,user_id)
         VALUES (:patient_title, :patient_fname, :patient_lname, :patient_tel, :patient_cid, :patient_addr , NOW(), NOW(), :user_id)",
        params! {
            "patient_title" => patient_title,
            "patient_fname" => patient_fname,
            "patient_lname" => patient_lname,
            "patient_tel" => patient_tel,
            "patient_cid" => patient_cid,
            "patient_addr" => patient_addr,
            "user_id" => user_id
        }
    ){
        Ok(_patient) => _patient,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    // Retrieve the last inserted ID
    let last_id = conn.last_insert_id();

    let slip_patient_number = format!("{:05}", last_id);
    let _slip_patient_number = "HN".to_owned()+&slip_patient_number;

    let _patientUpdate = match  conn.exec_drop(
        "UPDATE patient SET patient_hn = :patient_hn WHERE patient_id = :patient_id",
          params! {
              "patient_hn" => _slip_patient_number,
              "patient_id" => last_id,
          }
      ){
        Ok(_patientUpdate) => _patientUpdate,
        Err(err) => return Err(format!("Failed to execute update query: {}", err)),
    };


    // let _phistory = match conn.exec_drop(
    //   "INSERT INTO phistory (patient_hn,phistory_date, phistory_created, phistory_updated,user_id)
    //     VALUES (:patient_hn ,  NOW() , NOW(), NOW(),:user_id)",
    //   params! {
    //       "patient_hn" => _slip_patient_number,
    //       "user_id"=> user_id
    //   }
    // ){
    //   Ok(_phistory) => _phistory,
    //   Err(err) => return Err(format!("Failed to phistory execute insert query: {}", err)),
    // };

    println!("Last insert ID: {}", last_id);
     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn read_patients() -> Result<Vec<Patient>, String> {
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };
    // Perform a SELECT query.
    let patients: Vec<Patient> = match conn.query_map(
      "SELECT
          p.patient_hn AS hn,
          CONCAT( p.patient_title, p.patient_fname, ' ', p.patient_lname ) AS name,
          IFNULL(p.patient_tel,'-') AS tel,
          IFNULL(MAX(s.phistory_date),'-') AS last_date
        FROM
            patient AS p
        LEFT JOIN  phistory AS s
        ON p.patient_hn = s.patient_hn
        GROUP BY  p.patient_hn
        ORDER BY p.patient_hn DESC",
      |(hn, name, tel, last_date)| Patient { hn, name, tel, last_date },
    ) {
        Ok(patients) => patients,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    Ok(patients)
}


#[command]
async fn read_patient_hn(hn: String) -> Result<Option<PatientById>,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

    let _patient: Option<PatientById> = match conn.exec_first(
        "SELECT
            patient_hn ,
            patient_title,
            patient_fname,
            patient_lname,
            IFNULL(patient_tel,'') AS patient_tel,
            IFNULL(patient_cid,'') AS patient_cid,
            IFNULL(patient_addr,'') AS patient_addr
          FROM patient
          WHERE patient_hn = :hn",
          params! {
              "hn" => hn,
          }
    ){
              Ok(_patient) => _patient,
              Err(err) => return Err(format!("Failed to execute query: {}", err)),
          };

    Ok(_patient)
}

#[command]
async fn update_patient_hn(
  patient_title:String,
  patient_fname:String,
  patient_lname:String,
  patient_tel:String,
  patient_cid:String,
  patient_addr:String,
  user_id:u32,
  hn:String
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

      let userUpdate = match  conn.exec_drop(
        "UPDATE patient SET
          patient_title = :patient_title,
          patient_fname = :patient_fname,
          patient_lname = :patient_lname,
          patient_tel = :patient_tel,
          patient_cid = :patient_cid,
          patient_addr = :patient_addr,
          patient_updated = NOW(),
          user_id = :user_id
          WHERE patient_hn = :hn",
          params! {
            "patient_title" => patient_title,
            "patient_fname" => patient_fname,
            "patient_lname" => patient_lname,
            "patient_tel" => patient_tel,
            "patient_cid" => patient_cid,
            "patient_addr" => patient_addr,
            "user_id" => user_id,
            "hn" => hn
          }
      ){
        Ok(userUpdate) => userUpdate,
        Err(err) => return Err(format!("Failed to execute update query: {}", err)),
      };




    // println!("Last insert ID: {}", user_id);
     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn read_phistory_hn(hn: String) -> Result<Vec<PhistoryById>,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

    let _phistory: Vec<PhistoryById> = match conn.exec_map(
        "SELECT DATE_FORMAT(phistory_date, '%Y-%m-%d') AS phistory_date,TIME_FORMAT(p.phistory_time, '%H:%i:%s') AS phistory_time, CONCAT( s.user_title, s.user_fname, ' ', s.user_lname ) AS phistory_name
            FROM phistory AS p
            INNER JOIN users AS s
            ON s.user_id = p.user_id
            WHERE p.patient_hn = :hn
          ORDER BY p.phistory_date,p.phistory_time DESC",
          params! {
              "hn" => hn,
          },
          |(phistory_date,phistory_time,phistory_name)| PhistoryById { phistory_date,phistory_time,phistory_name },
          ){
                    Ok(_phistory) => _phistory,
                    Err(err) => return Err(format!("Failed to execute query: {}", err)),
                };

    Ok(_phistory)
}


#[command]
async fn create_phistory(
  phistory_hn:String,
  user_id:u32,
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };


    let _phistory = match conn.exec_drop(
        "INSERT INTO phistory (patient_hn, phistory_date, phistory_time,phistory_created, phistory_updated,user_id)
         VALUES (:patient_hn, NOW(), NOW(), NOW(), NOW(), :user_id)",
        params! {
            "patient_hn" => phistory_hn,
            "user_id" => user_id
        }
    ){
        Ok(_phistory) => _phistory,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn read_report_date(begin: String,end:String) -> Result<Vec<ReportByDate>,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

    let _reports: Vec<ReportByDate> = match conn.exec_map(
        "SELECT
          p.patient_hn AS hn,
          CONCAT( p.patient_title, p.patient_fname, ' ', p.patient_lname ) AS name,
          IFNULL(patient_tel,'') AS tel,
          DATE_FORMAT(s.phistory_date, '%Y-%m-%d') AS date,
          DATE_FORMAT(s.phistory_time, '%H:%i:%s') AS time
        FROM
            patient AS p
        INNER JOIN  phistory AS s
        ON p.patient_hn = s.patient_hn
        WHERE DATE_FORMAT(phistory_date, '%Y-%m-%d') BETWEEN :begin AND :end
        ORDER BY s.phistory_date,s.phistory_time DESC
        ",
          params! {
              "begin" => begin,
              "end" => end
          },
          |(hn,name,tel,date,time)| ReportByDate { hn,name,tel,date,time },
          ){
                    Ok(_reports) => _reports,
                    Err(err) => return Err(format!("Failed to execute query: {}", err)),
                };

    Ok(_reports)
}



fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      read_users,
      read_user_id,
      create_and_update_item,
      update_user_id,
      login_user,
      create_and_update_patient,
      read_patients,
      read_patient_hn,
      update_patient_hn,
      read_phistory_hn,
      create_phistory,
      read_report_date
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
