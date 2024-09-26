/*
 Navicat Premium Data Transfer

 Source Server         : clinic_db
 Source Server Type    : MySQL
 Source Server Version : 80017 (8.0.17)
 Source Host           : localhost:3306
 Source Schema         : clinic_db

 Target Server Type    : MySQL
 Target Server Version : 80017 (8.0.17)
 File Encoding         : 65001

 Date: 14/09/2024 21:37:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for patient
-- ----------------------------
DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient`  (
  `patient_id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'รหัส',
  `patient_hn` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'hn',
  `patient_title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'คำนำหน้า',
  `patient_fname` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ชื่อ',
  `patient_lname` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'สกุล',
  `patient_tel` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'เบอร์',
  `patient_cid` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ปปช',
  `patient_addr` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'ที่อยู่',
  `patient_created` datetime NULL DEFAULT NULL COMMENT 'สร้าง',
  `patient_updated` datetime NULL DEFAULT NULL COMMENT 'อัพเดต',
  `user_id` int(10) NULL DEFAULT NULL COMMENT 'ผู้บันทึก',
  PRIMARY KEY (`patient_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patient
-- ----------------------------

-- ----------------------------
-- Table structure for phistory
-- ----------------------------
DROP TABLE IF EXISTS `phistory`;
CREATE TABLE `phistory`  (
  `phistory_id` int(50) NOT NULL AUTO_INCREMENT COMMENT 'รหัส',
  `patient_hn` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รหัสคนไข้',
  `phistory_date` datetime NULL DEFAULT NULL COMMENT 'วันรับบริการ',
  `phistory_created` datetime NULL DEFAULT NULL COMMENT 'สร้าง',
  `phistory_updated` datetime NULL DEFAULT NULL COMMENT 'อัพเดต',
  `user_id` int(10) NULL DEFAULT NULL COMMENT 'ผู้บันทึก',
  PRIMARY KEY (`phistory_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of phistory
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'รหัสผู้ใช้งาน',
  `user_code` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รหัสบาร์โค้ด',
  `user_title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'คำนำหน้า',
  `user_fname` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ชื่อ',
  `user_lname` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'นามสกุล',
  `user_position` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ตำแหน่ง',
  `user_username` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `user_password` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รหัสผ่าน',
  `user_created` datetime NULL DEFAULT NULL COMMENT 'วันที่ลงทะเบียน',
  `user_updated` datetime NULL DEFAULT NULL COMMENT 'วันที่อัปเดต',
  `user_status` enum('active','inactive') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'active' COMMENT 'สถานะผู้ใช้งาน',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'EMP-0001', 'นาย', 'ประมวล', 'นัดทะยาย', 'ผู้ดูแลระบบ', 'admin', '3953a9aa903aa248d9b2e89e21043157', '2024-09-08 11:57:55', '2024-09-14 21:34:16', 'active');
INSERT INTO `users` VALUES (6, 'EMP-0006', 'เด็กชาย', 'ธราดล', 'นัดทะยาย', 'ลูกแพทย์', 'iden', '3953a9aa903aa248d9b2e89e21043157', '2024-09-14 20:18:33', '2024-09-14 21:34:21', 'active');

SET FOREIGN_KEY_CHECKS = 1;
