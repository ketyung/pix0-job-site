alter table GoogleCredential modify id varchar(30) ;

alter table UserCompany modify id varchar(30) ;

alter table UserCompany add description text after logoUrl;

alter table UserCompany modify logoUrl text; 

alter table UserCompany add logoUrlPubId varchar(150) after logoUrl;

alter table JobPost modify id varchar(30);