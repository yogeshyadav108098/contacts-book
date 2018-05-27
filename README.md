# contacts-book v1.0.0

Contacts book written in node

- [APIDoc](#apidoc)
	- [API DOC](#api-doc)
	
- [Contacts](#contacts)
	- [Add](#add)
	- [Delete](#delete)
	- [List](#list)
	- [Update](#update)
	
- [HealthCheck](#healthcheck)
	- [Health Check Status](#health-check-status)
	
- [Readme](#readme)
	- [API DOC](#api-doc)
	


# APIDoc

## API DOC



	GET /contacts-book/apiDoc


### Success Response

Success-Response:

```
generates html page
```
# Contacts

## Add



	POST /contacts-book/v1/contacts


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| String			|  <p>Name</p>							|
| email			| String			|  <p>Email</p>							|
| gender			| String			|  <p>Gender (Default Value MALE)</p>							|

### Success Response

Success-Response:

```
{
     id:  1
     result: Contact created successfully
}
```
## Delete



	DELETE /contacts-book/v1/contacts/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| Number			|  <p>Contact DB Id</p>							|

### Success Response

Success-Response:

```
{
     id:  1,
     changedRows:  1,
     result: Contact deleted successfully
}
```
## List



	GET /contacts-book/v1/contacts


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| Number			|  <p>Id</p>							|
| name			| String			|  <p>Name</p>							|
| email			| String			|  <p>Email</p>							|
| gender			| String			|  <p>Gender</p>							|
| status			| String			|  <p>Status</p>							|
| beforeId			| Number			|  <p>Before Id</p>							|
| afterId			| Number			|  <p>afterId</p>							|
| limit			| Number			|  <p>limit</p>							|
| offset			| Number			|  <p>offset</p>							|
| orderBy			| String			|  <p>Order by</p>							|
| patternMatch			| String			|  <p>Pattern (true)</p>							|
| columns			| String			|  <p>Columns</p>							|
| count			| String			|  <p>Count (id)</p>							|
| distinctColumn			| String			|  <p>Distinct Column (id)</p>							|
| distinctCount			| String			|  <p>Distinct Count (id)</p>							|

### Success Response

Success-Response:

```
[{
   "id": 1,
   "name": "Yogesh Yadav",
   "email": "yogeshyadav108098@gmail.com",
   "gender": "MALE",
   "status": 1,
   "createdAt": "2017-05-26T11:57:37.000Z",
   "updatedAt": "2017-05-26T11:57:37.000Z"
}]
```
## Update



	PUT /contacts-book/v1/contacts/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| Number			|  <p>Contact DB Id</p>							|
| name			| String			|  <p>Name</p>							|
| email			| String			|  <p>Email</p>							|
| gender			| String			|  <p>Gender</p>							|
| status			| Number			|  <p>Status</p>							|

### Success Response

Success-Response:

```
{
     id:  1
     result: Contact edited successfully
}
```
# HealthCheck

## Health Check Status



	GET /contacts-book/_status


### Success Response

Success-Response:

```
{
   result: 'OK'
}
```
# Readme

## API DOC



	GET /contacts-book/readme


### Success Response

Success-Response:

```
{
   result: 'ReadMe file generated'
}
```

