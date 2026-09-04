-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2025 at 08:22 PM
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
(1, 'TestT', 'Computer Science', 'Test', 'Research', '2025-09-23', 'Approved'),
(2, '133333333333333', 'Engineering', 'a33333333', 'Review', '2025-09-23', 'Rejected'),
(3, 'ธธธธธธธธธธธธธธ222', 'Engineering', 'a22', 'Review', '2025-09-23', 'Approved'),
(9, '11111111111111111111111112222', 'Computer Science', '1111111111222', 'Research', '2025-09-23', 'Pending'),
(11, 'aaaaaaaaaaaaaaaaaa', 'Computer Science', 'aaaaaaaaa', 'Research', '2025-09-23', 'Approved'),
(13, 'qweqweqwe', 'Engineering', 'q', 'Review', '2025-09-23', 'Pending'),
(15, 'fghfghfghfghfghfghfgh', 'Computer Science', 'fhfghfgh', 'Review', '2025-09-23', 'Approved'),
(16, 'f', 'Computer Science', 'f', 'Research', '2025-09-23', 'Approved'),
(17, '22', 'Computer Science', '2', 'Research', '2025-09-10', 'Pending'),
(19, '12354', 'Computer Science', '4', 'อื่นๆ', '2025-09-23', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `articlehistory`
--

CREATE TABLE `articlehistory` (
  `A_id` int(11) NOT NULL,
  `A_date` date NOT NULL,
  `A_comment` varchar(300) NOT NULL,
  `article_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articlehistory`
--

INSERT INTO `articlehistory` (`A_id`, `A_date`, `A_comment`, `article_id`) VALUES
(1, '2025-09-23', '1', 1),
(4, '2025-09-23', '333', 2),
(5, '2025-09-23', '2', 9),
(7, '2025-09-23', 'qwe', 13),
(9, '2025-09-23', 'asd', 11),
(10, '2025-09-23', 'fgh', 15);

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
(1, '2025-09-22 16:24:07', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 1, 1),
(2, '2025-09-22 16:24:26', 'vasfadf', 1, 1),
(3, '2025-09-22 16:25:07', 'dcascfaxz', 1, 2),
(4, '2025-09-22 16:38:08', 'หฟฟฟฟฟฟฟฟฟฟฟฟ', 1, 2),
(5, '2025-09-22 16:52:04', 'asdasczxcxzczxcxvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', 1, 1),
(6, '2025-09-22 17:08:33', '11111111111111111111111111111', 2, 1),
(7, '2025-09-22 17:09:00', '', 2, 1),
(8, '2025-09-22 17:13:05', 'asdasda', 2, 1),
(9, '2025-09-22 17:19:42', '000000000000000000000000000000000000000000000000000000', 2, 2),
(10, '2025-09-23 23:26:26', '', 2, 16),
(11, '2025-09-24 01:00:23', '', 2, 11),
(12, '2025-09-24 01:00:37', '', 2, 1);

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
(5, 'Teacher', '$2b$10$jonqa.SHOgOK.NS9hzn64OY7RWLllKoU8cS4GnhZ38/RA.lIw87ti', 'Teacher@Teacher', '1'),
(13, 'sdf', '$2b$10$/Kn04gpOBrn78ZfapbX8Ce6ZoAkmqbKOBi/RBfrhLWgpjXQj8is.6', 'sdf', '1'),
(14, '][ppย', '$2b$10$N9zEwq.HgLeVj2bgCKsng.0VJdhPuU/ZnCDghfcnZbh5V7/D8dHGG', '][ppย', '2'),
(15, 'qwe', '$2b$10$Vb5vcLhY3YWTf3l40g1eye7vNpmsUIWKnOuVdBWoqS79Z3M.j9tzO', 'qwe', '2'),
(17, 'R', '$2b$10$CPZ8pEyEUuCFtT1bT9tCeuGBIRk/AlxYp96qLyOnsxatlGcddSUf2', 'R', ''),
(18, 't', '$2b$10$Sv4ffVbd9juQTyQU.OFD0.6ixaYZ3N8iijCszwbzqNh/a9fSqGiQK', 't', '1'),
(19, 'dasd', '$2b$10$Dt8rs.r8Gy526K/7t3JTBOPST9zbWhLIdhVJeyUhxBPeGhKxgrI.6', 'asda@asd.com', '1'),
(20, '1111111', '$2b$10$fqB33vwBsK53nM..uWTx8OyzzeeqxqxBFOHrWQ4GzPPjwUF4GiGBe', 'gf@asd.cx', '1');

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
(1, '2025-09-20 16:06:55', 5),
(2, '2025-09-20 16:46:41', 1),
(3, '2025-09-20 17:05:26', 5),
(4, '2025-09-20 17:10:24', 2),
(5, '2025-09-20 18:04:46', 1),
(6, '2025-09-21 19:36:52', 1),
(7, '2025-09-21 19:40:02', 2),
(8, '2025-09-21 20:32:28', 1),
(9, '2025-09-21 20:32:53', 5),
(10, '2025-09-21 20:33:13', 2),
(11, '2025-09-21 20:53:09', 1),
(12, '2025-09-21 20:53:58', 2),
(13, '2025-09-21 21:05:19', 1),
(14, '2025-09-21 21:05:48', 5),
(15, '2025-09-21 21:06:07', 2),
(16, '2025-09-21 21:09:30', 1),
(17, '2025-09-21 21:10:35', 2),
(18, '2025-09-21 21:17:13', 1),
(19, '2025-09-21 21:22:11', 2),
(20, '2025-09-22 15:23:10', 2),
(21, '2025-09-22 15:23:10', 2),
(22, '2025-09-22 18:10:16', 1),
(23, '2025-09-22 18:29:42', 13),
(24, '2025-09-22 18:30:31', 13),
(25, '2025-09-23 17:05:13', 2),
(26, '2025-09-23 17:43:50', 5),
(27, '2025-09-23 19:35:39', 13),
(28, '2025-09-23 19:36:37', 13),
(29, '2025-09-23 23:25:57', 2),
(30, '2025-09-23 23:30:40', 1),
(31, '2025-09-23 23:33:50', 1),
(32, '2025-09-23 23:38:09', 5),
(33, '2025-09-24 00:57:29', 1),
(34, '2025-09-24 00:57:59', 2),
(35, '2025-09-24 01:16:10', 5),
(36, '2025-09-24 01:19:05', 2);

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
(5, 1, '1'),
(5, 3, '1'),
(13, 11, '1'),
(13, 13, '1'),
(13, 15, '1'),
(13, 16, '1'),
(13, 17, '1'),
(13, 19, '1');

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
  ADD PRIMARY KEY (`user_id`);

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
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `articlehistory`
--
ALTER TABLE `articlehistory`
  MODIFY `A_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `n_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `userlog`
--
ALTER TABLE `userlog`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

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
