-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 04, 2026 at 10:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `research`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `article_id` int(11) NOT NULL,
  `article_title` varchar(100) NOT NULL,
  `article_category` enum('Computer Science','Engineering') NOT NULL,
  `article_link` varchar(100) NOT NULL,
  `article_type` enum('Research','Review','อื่นๆ') NOT NULL,
  `article_date` date NOT NULL,
  `article__status` enum('Pending','Revision','Approved','Rejected') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`article_id`, `article_title`, `article_category`, `article_link`, `article_type`, `article_date`, `article__status`) VALUES
(3, 'ChatDev', 'Computer Science', '/uploads/1786105900718_2024.acl-long.810.pdf', 'Research', '2026-08-07', 'Approved'),
(7, 'TestButton3', 'Computer Science', '/uploads/1786108552985_ChatGPT_and_Software_Testing_Education_Promises_amp_Perils.pdf', 'Research', '2026-08-07', 'Approved'),
(9, 'TestArticle1', 'Computer Science', '/uploads/1786346243382_2024.acl-long.810.pdf', 'Research', '2026-08-10', 'Approved'),
(12, 'T', 'Computer Science', '/uploads/1787050606278_111.pdf', 'Research', '2026-08-18', 'Approved'),
(13, 'AAAAAAAA', 'Computer Science', '/uploads/1787132254431_111.pdf', 'Research', '2026-08-19', 'Approved'),
(14, 'ASD', 'Computer Science', '/uploads/1787150954424_111.pdf', 'Research', '2026-08-19', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `articlehistory`
--

CREATE TABLE `articlehistory` (
  `A_id` int(11) NOT NULL,
  `A_date` datetime NOT NULL,
  `A_comment` varchar(300) NOT NULL,
  `article_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articlehistory`
--

INSERT INTO `articlehistory` (`A_id`, `A_date`, `A_comment`, `article_id`) VALUES
(4, '2026-08-19 16:58:28', 'aaaaaaaaaaaaaa', 13);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `n_id` int(11) NOT NULL,
  `n_dare` datetime NOT NULL,
  `n_comment` varchar(300) NOT NULL,
  `user_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`n_id`, `n_dare`, `n_comment`, `user_id`, `article_id`) VALUES
(3, '2026-08-07 19:32:04', '', 2, 3),
(9, '2026-08-07 20:19:10', '', 2, 7),
(11, '2026-08-10 14:22:03', '', 2, 9),
(12, '2026-08-18 17:52:37', 'Comment', 2, 9),
(13, '2026-08-18 17:53:58', 'TestRejected', 2, 9),
(14, '2026-08-18 17:54:12', 'Approved', 2, 9),
(15, '2026-08-19 16:56:50', 'TTTESTTT', 2, 12),
(16, '2026-08-19 16:57:02', 'TESTTT', 2, 13),
(17, '2026-08-19 16:59:03', 'ATEST', 2, 13);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_password` varchar(500) NOT NULL,
  `user_email` varchar(50) DEFAULT NULL,
  `user_type` enum('1','2','3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_password`, `user_email`, `user_type`) VALUES
(1, 'Admin', '$2b$10$9Vi281fF0J..08VGi2m02eOMNXEZCMNQlFcJUszUT/q/fE3f32ODG', 'Admin@Admin', '3'),
(2, 'Staff', '$2b$10$DxXT878MZ6m3Sn/eWhycYeTlm5tbVnVBCrFmn7YaCC7qJCM30ASP2', 'Staff@Staff', '2'),
(3, 'Teacher', '$2b$10$jonqa.SHOgOK.NS9hzn64OY7RWLllKoU8cS4GnhZ38/RA.lIw87ti', 'Teacher@Teacher', '1'),
(4, 'TestTeacher0', '$2b$10$WPYg0GYHAZyDAh6doA99UOR17DpnnONC2Il0QTw1YrmPUIvtoND6y', 'TestTeacher@TestTeacher.com', '1'),
(6, 'Test2', '$2b$10$9HAurhwKf.T0uIRWyhckCezrQnDR4wPooDa6ERx1.n7b058bhXUU.', 'Test@Test.com', '3');

-- --------------------------------------------------------

--
-- Table structure for table `userlog`
--

CREATE TABLE `userlog` (
  `u_id` int(11) NOT NULL,
  `u_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userlog`
--

INSERT INTO `userlog` (`u_id`, `u_date`, `user_id`) VALUES
(1, '2026-08-07 19:16:09', 3),
(3, '2026-08-07 19:24:52', 2),
(5, '2026-08-07 19:27:12', 1),
(6, '2026-08-07 19:29:22', 2),
(7, '2026-08-07 19:30:47', 3),
(8, '2026-08-07 19:31:54', 2),
(9, '2026-08-07 20:00:18', 3),
(10, '2026-08-07 20:02:04', 2),
(11, '2026-08-07 20:13:33', 3),
(12, '2026-08-07 20:18:47', 2),
(13, '2026-08-07 20:34:35', 3),
(14, '2026-08-07 20:45:12', 2),
(15, '2026-08-10 12:19:28', 1),
(16, '2026-08-10 12:47:31', 1),
(17, '2026-08-10 12:55:13', 1),
(18, '2026-08-10 13:55:43', 2),
(19, '2026-08-10 14:12:04', 4),
(20, '2026-08-10 14:21:36', 2),
(21, '2026-08-10 14:22:40', 4),
(22, '2026-08-16 15:27:41', 4),
(23, '2026-08-16 15:29:07', 4),
(24, '2026-08-16 15:56:39', 1),
(25, '2026-08-16 16:03:21', 4),
(26, '2026-08-17 20:51:48', 3),
(27, '2026-08-17 20:52:28', 1),
(28, '2026-08-17 20:52:51', 2),
(29, '2026-08-18 17:50:49', 1),
(30, '2026-08-18 17:52:12', 2),
(31, '2026-08-18 17:55:10', 3),
(32, '2026-08-18 17:55:10', 3),
(33, '2026-08-18 17:56:22', 6),
(34, '2026-08-19 10:30:10', 3),
(35, '2026-08-19 11:31:46', 1),
(36, '2026-08-19 16:08:06', 1),
(37, '2026-08-19 16:21:33', 3),
(38, '2026-08-19 16:47:56', 2),
(39, '2026-08-19 16:57:56', 3),
(40, '2026-08-19 16:58:46', 2),
(41, '2026-08-19 16:59:20', 1),
(42, '2026-08-19 20:49:12', 3),
(43, '2026-08-19 20:50:31', 2),
(44, '2026-08-19 21:47:02', 1),
(45, '2026-08-19 21:48:50', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_article`
--

CREATE TABLE `user_article` (
  `user_id` int(11) NOT NULL,
  `article` int(11) NOT NULL,
  `is_owner` enum('1','0','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_article`
--

INSERT INTO `user_article` (`user_id`, `article`, `is_owner`) VALUES
(3, 0, '1'),
(3, 3, '1'),
(3, 7, '1'),
(4, 9, '1'),
(6, 12, '1'),
(3, 13, '1'),
(3, 14, '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`article_id`);

--
-- Indexes for table `articlehistory`
--
ALTER TABLE `articlehistory`
  ADD PRIMARY KEY (`A_id`),
  ADD KEY `article_id` (`article_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`n_id`),
  ADD KEY `article_id` (`article_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_email` (`user_email`);

--
-- Indexes for table `userlog`
--
ALTER TABLE `userlog`
  ADD PRIMARY KEY (`u_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_article`
--
ALTER TABLE `user_article`
  ADD KEY `article` (`article`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `articlehistory`
--
ALTER TABLE `articlehistory`
  MODIFY `A_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `n_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `userlog`
--
ALTER TABLE `userlog`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articlehistory`
--
ALTER TABLE `articlehistory`
  ADD CONSTRAINT `articlehistory_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `userlog`
--
ALTER TABLE `userlog`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `user_article`
--
ALTER TABLE `user_article`
  ADD CONSTRAINT `user_article_ibfk_1` FOREIGN KEY (`article`) REFERENCES `article` (`article_id`),
  ADD CONSTRAINT `user_article_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
