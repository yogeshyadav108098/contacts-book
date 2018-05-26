CREATE TABLE contacts(
    id int(12) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255),
    gender ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    status tinyint(3) NOT NULL DEFAULT 1,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY idxEmail (email),
    KEY idxName (name),
    KEY idxStatus (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Contacts info';


