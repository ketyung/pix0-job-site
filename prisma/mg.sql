alter table GoogleCredential modify id varchar(30) ;

alter table UserCompany modify id varchar(30) ;

alter table UserCompany add description text after logoUrl;

alter table UserCompany modify logoUrl text; 

alter table UserCompany add logoUrlPubId varchar(150) after logoUrl;

alter table JobPost modify id varchar(30);

alter table JobPost add jobStatus varchar(20) after location;

alter table JobPost add  applyAtExt enum('Y','N') default 'N' after salaryTo;

alter table JobPost add  applyAtUrl text after applyAtExt;

alter table JobPost add datePub datetime after applyAtUrl;

alter table User add about varchar(255) after googleId;


CREATE TABLE UserResume (
    id VARCHAR(30) PRIMARY KEY,
    userId VARCHAR(30),
    resumeData TEXT,
    resumeText TEXT,
    CONSTRAINT user_resume_id_unique_constraint UNIQUE (id)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE UserResume
ADD CONSTRAINT user_resume_fk_1 FOREIGN KEY (userId) REFERENCES User(id);
