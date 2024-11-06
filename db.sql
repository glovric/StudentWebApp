-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 06, 2024 at 08:17 PM
-- Server version: 8.0.39-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `associates`
--

CREATE TABLE `associates` (
  `id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `associates`
--

INSERT INTO `associates` (`id`, `course_id`, `teacher_id`) VALUES
(1, 2, 2),
(2, 2, 3),
(3, 3, 2),
(4, 4, 1),
(6, 6, 4),
(7, 7, 1),
(8, 7, 2);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `points` int NOT NULL,
  `image_url` varchar(2048) NOT NULL,
  `coordinator_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `points`, `image_url`, `coordinator_id`) VALUES
(1, 'Mathematics', 5, 'https://www.clarkson.edu/sites/default/files/2023-06/Mathematics-Hero-1600x900.jpg', 1),
(2, 'Programming', 3, 'https://static01.nyt.com/images/2023/06/05/opinion/02Manjoo-1/02Manjoo-1-articleLarge.jpg?quality=75&auto=webp&disable=upscale', 1),
(3, 'Machine Learning', 6, 'https://innovait.cat/wp-content/uploads/2022/03/Machine-learning.png', 4),
(4, 'Monetary policy', 4, 'https://www.imf.org/-/media/Images/IMF/About/Factsheets/2022/monetary-policy-graphics-03.ashx', 5),
(6, 'PLC programming', 4, 'https://i.ytimg.com/vi/ReTtgzN-Dmc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD_ckGfYvqPlnmTt3Fg2zAVsjgO-w', 2),
(7, 'Deep Learning', 6, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpQr0KNCHADzdiRzPaqWOficwIDg3bf-jtqg&s', 4);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint NOT NULL,
  `enrollment_date` datetime(6) NOT NULL,
  `course_id` bigint NOT NULL,
  `student_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `enrollment_date`, `course_id`, `student_id`) VALUES
(61, '2024-11-02 23:05:40.394319', 7, 8),
(62, '2024-11-02 23:05:44.311457', 7, 7),
(64, '2024-11-02 23:09:16.804846', 3, 4),
(65, '2024-11-02 23:09:19.484164', 4, 4),
(67, '2024-11-04 18:31:21.501592', 2, 3),
(68, '2024-11-05 10:19:22.273219', 2, 7),
(70, '2024-11-05 17:58:35.943303', 2, 4),
(72, '2024-11-06 11:06:45.131269', 4, 7);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint NOT NULL,
  `academic_id` varchar(8) NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `academic_id`, `user_id`) VALUES
(3, '42048424', 4),
(4, '42015314', 5),
(7, '42013185', 8),
(8, '42086149', 9);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` bigint NOT NULL,
  `department` varchar(255) NOT NULL,
  `academic_title` varchar(50) NOT NULL,
  `academic_id` varchar(15) NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `department`, `academic_title`, `academic_id`, `user_id`) VALUES
(1, 'CS', 'doc. dr. sc.', '4200000000000', 3),
(2, 'CS', 'univ. mag. comp.', '42012345', 10),
(3, 'CS', 'univ. mag. el.', '42054321', 11),
(4, 'ML', 'doc. dr. sc.', '42078923', 12),
(5, 'Economics', 'univ. bacc. oec.', '42078925', 6),
(6, 'CS', 'univ. mag. comp.', '42078912', 13);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `associates`
--
ALTER TABLE `associates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `associates_teacher_id_bfc8ae11_fk_teachers_id` (`teacher_id`),
  ADD KEY `associates_course_id_b79f52d9_fk_courses_id` (`course_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_coordinator_id_a1aec751_fk_teachers_id` (`coordinator_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `enrollments_student_id_course_id_bba60245_uniq` (`student_id`,`course_id`),
  ADD KEY `enrollments_course_id_8964c6c8_fk_courses_id` (`course_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `academic_id` (`academic_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `associates`
--
ALTER TABLE `associates`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `associates`
--
ALTER TABLE `associates`
  ADD CONSTRAINT `associates_course_id_b79f52d9_fk_courses_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `associates_teacher_id_bfc8ae11_fk_teachers_id` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_coordinator_id_a1aec751_fk_teachers_id` FOREIGN KEY (`coordinator_id`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_course_id_8964c6c8_fk_courses_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `enrollments_student_id_19c0bed4_fk_students_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_user_id_42864fc9_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_user_id_6fdcda53_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
