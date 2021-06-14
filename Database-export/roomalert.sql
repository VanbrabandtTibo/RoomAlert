-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: roomalert
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device` (
  `idDevice` int NOT NULL,
  `naam` varchar(45) NOT NULL,
  `aankoopkost` float NOT NULL,
  `meeteenheid` varchar(45) NOT NULL,
  `typeID` int NOT NULL,
  PRIMARY KEY (`idDevice`),
  KEY `fk_device_type1_idx` (`typeID`),
  CONSTRAINT `fk_device_type1` FOREIGN KEY (`typeID`) REFERENCES `type` (`idtype`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'CCS811 Air quality',19,'eCO2',1),(2,'DHT22 Humidity',2.95,'%',1),(3,'DHT22 Temperatuur',2.95,'°C',1),(4,'RFID',7,'UID',1),(5,'RGB Neopixel',3.95,'Kleur',2),(6,'Buzzer',0.35,'Tone',2),(7,'LCD 16 x 2',3.19,'Tekst',3);
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historiek`
--

DROP TABLE IF EXISTS `historiek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historiek` (
  `idhistoriek` int NOT NULL,
  `datumtijd` datetime NOT NULL,
  `waarde` varchar(150) NOT NULL,
  `deviceID` int NOT NULL,
  PRIMARY KEY (`idhistoriek`),
  KEY `fk_historiek_device_idx` (`deviceID`),
  CONSTRAINT `fk_historiek_device` FOREIGN KEY (`deviceID`) REFERENCES `device` (`idDevice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historiek`
--

LOCK TABLES `historiek` WRITE;
/*!40000 ALTER TABLE `historiek` DISABLE KEYS */;
INSERT INTO `historiek` VALUES (1,'2021-08-24 00:00:00','172',1),(2,'2022-01-02 00:00:00','18',3),(3,'2021-08-24 00:00:00','51',2),(4,'2021-09-11 00:00:00','161',1),(5,'2021-11-07 00:00:00','9,82,77,14',4),(6,'2022-03-16 00:00:00','226',1),(7,'2022-04-24 00:00:00','120',1),(8,'2021-10-26 00:00:00','228',1),(9,'2021-06-21 00:00:00','245,23,215,101',4),(10,'2022-05-01 00:00:00','250',1),(11,'2022-02-13 00:00:00','144',1),(12,'2022-03-09 00:00:00','38',2),(13,'2021-08-18 00:00:00','126',1),(14,'2021-07-04 00:00:00','103',1),(15,'2021-05-31 00:00:00','76',2),(16,'2021-09-25 00:00:00','Geel',5),(17,'2022-03-26 00:00:00','14',3),(18,'2021-11-20 00:00:00','58',2),(19,'2021-11-19 00:00:00','Oranje',5),(20,'2021-08-24 00:00:00','123',1),(21,'2021-10-01 00:00:00','Rood',5),(22,'2021-10-14 00:00:00','Tone',6),(23,'2022-01-26 00:00:00','46',2),(24,'2021-08-25 00:00:00','162',1),(25,'2022-01-14 00:00:00','175',1),(26,'2021-10-12 00:00:00','213',1),(27,'2022-02-06 00:00:00','179',1),(28,'2022-02-12 00:00:00','173',1),(29,'2022-05-17 00:00:00','165',1),(30,'2021-09-05 00:00:00','11',3),(31,'2022-01-09 00:00:00','108',1),(32,'2022-01-24 00:00:00','184',1),(33,'2021-11-04 00:00:00','40',2),(34,'2021-08-11 00:00:00','24',3),(35,'2021-06-28 00:00:00','170',1),(36,'2021-06-29 00:00:00','196',1),(37,'2021-10-30 00:00:00','153',1),(38,'2021-08-18 00:00:00','121',1),(39,'2022-03-25 00:00:00','Temperatuur: 36°C eCO2: 150 Humadity: 56%',7),(40,'2022-01-19 00:00:00','64',2),(41,'2022-05-19 00:00:00','245',1),(42,'2021-12-27 00:00:00','64',2),(43,'2021-05-02 00:00:00','129',1),(44,'2021-08-07 00:00:00','177',1),(45,'2021-06-28 00:00:00','223',1),(46,'2021-07-18 00:00:00','31',2),(47,'2022-04-10 00:00:00','167',1),(48,'2021-08-13 00:00:00','151',1),(49,'2021-12-23 00:00:00','197',1),(50,'2021-05-09 00:00:00','174',1);
/*!40000 ALTER TABLE `historiek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `idtype` int NOT NULL,
  `typenaam` varchar(45) NOT NULL,
  PRIMARY KEY (`idtype`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'Sensor'),(2,'Actuator'),(3,'Display');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-26  7:37:30
