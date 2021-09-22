/// <reference types="cypress" />

describe("Paylocity API", function(){
Cypress.config("baseUrl","https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/")

const apiAuthorization= "Basic VGVzdFVzZXI0ODpMU2crMGhpP3k1Qyk="

it("GET Employee List-GET", function() {
    cy.request({
        method:"GET",
        url: "employees",
        headers: {
            Authorization: apiAuthorization
        }
    })
    .should((response) => {
        //Assert that status is 200 for successful GET request
        expect(response.status).to.eq(200)
        //Assert that length is 3
        //expect(response.body).to.have.length(3)
        //Assert some of the key value pairs
        expect(response.body[0]).to.have.any.keys('name', 'age', 'dependants', 'benefitsCost')

    })

});  
       
   const newUserData= {
    "firstName": "Conor",
    "lastName": "McGregor",
    "dependants": 3
   }     
   
    it("Add Employee-POST", ()=>{
        let id
        cy.request({
            method:"POST",
            url:"employees?=",
            headers: {
            Authorization: apiAuthorization
            },
            body: newUserData
        })
        .should((response) => {
            //Assert that status is 200 for successful POST request
            expect(response.status).to.eq(200)
            //Assert that the firstName is the same as newUserData(Conor) 
            expect(response.body.firstName).to.eq(newUserData.firstName)
            //Assert that the lastName is the same as newUserData(McGregor) 
            expect(response.body.lastName).to.eq(newUserData.lastName)
            //Assert that the dependants equals the same as newUserData(4) 
            expect(response.body.dependants).to.eq(newUserData.dependants)
            //take the id
            this.id=response.body.id
        }) 

    })

    it("Get Employee", ()=>{
        cy.request({
            method:"GET",
            //Pass it onto the GET request
            url:`employees/${this.id}`,
            headers: {
            Authorization: apiAuthorization
            }
               
        })
            .should((response)=>{
            //Assert that status is 200 for successful POST request
            expect(response.status).to.eq(200)
            //Assert that the firstName is the same as newUserData(Conor)
            expect(response.body.firstName).to.eq(newUserData.firstName)
            //Assert that the lastName is the same as newUserData(McGregor) 
            expect(response.body.lastName).to.eq(newUserData.lastName)
            //Assert that the dependants equals the same as newUserData(4)
            expect(response.body.dependants).to.eq(newUserData.dependants)
        })
    }) 

    const updateUserData= {
        "firstName": "Khabib",
        "lastName": "Nurmagomedov",
        "dependants": 28
       }   
   
       it("Update Employee-PUT", ()=>{
        
        cy.request({
            method:"PUT",
            //Pass it onto the GET request
            url:`employees`,
            headers: {
            Authorization: apiAuthorization
            },
            body: {
                "id":`${this.id}`,
                "firstName": updateUserData.firstName,
                "lastName": updateUserData.lastName,
                "dependants": updateUserData.dependants
               }  
               
        })
        .should((response)=>{
            expect(response.status).to.eq(200)
            //Assert that the firstName is the same as newUserData(Khabib)
            expect(response.body.firstName).to.eq(updateUserData.firstName)
            //Assert that the lastName is the same as newUserData(Nurmagomedov) 
            expect(response.body.lastName).to.eq(updateUserData.lastName)
            //Assert that the dependants equals the same as newUserData(4)
            expect(response.body.dependants).to.eq(updateUserData.dependants)
        
        })

    })

    it("Delete Employee-DELETE", ()=>{
        
        cy.request({
            method:"DELETE",
            //Pass it onto the GET request
            url:`employees/${this.id}`,
            headers: {
            Authorization: apiAuthorization
            },
            
               
        })
        .should((response)=>{
            expect(response.status).to.eq(200)
        })

        cy.request({
            method:"GET",
            url: "employees",
            headers: {
                Authorization: apiAuthorization
            }
        })
        .should((response) => {
            //Assert that status is 200 for successful GET request
            expect(response.status).to.eq(200)
            //Loops through and finds whether or not any of the record=updateUserData info
            Cypress._.each(response.body, (updatedUser) =>{
                //Assert First Name of the udpated user is not present in the webtable
                expect(updatedUser.firstName).to.not.equal(updateUserData.firstName)
                //Assert Last Name of the udpated user is not present in the webtable
                expect(updatedUser.lastName).to.not.eq(updateUserData.lastName)
                //Assert that the dependants does not equal the same as newUserData(28)
                    //change this if the depen
                expect(response.body.dependants).to.not.eq(updateUserData.dependants)

            })
    
        })
        

    })

    const InvalidUser= {
        
            "id": "fae3d954-f345-4deb-a4bf-83b4fb76e6c6",
            "firstName": "Jonathan",
            "lastName": "Irving",
            "dependants": 5
        
    }

    it("Verify a Invalid Employee is unable to be added via update-PUT", ()=>{
        
        cy.request({
            method:"PUT",
            //Pass it onto the GET request
            url:`employees`,
            headers: {
            Authorization: apiAuthorization
            },
            body: {
                "id":InvalidUser.id,
                "firstName": InvalidUser.firstName,
                "lastName": InvalidUser.lastName,
                "dependants": InvalidUser.dependants
               }  
               
        })
        .should((response)=>{
            //Assert that the response does not return a 200 because this is invalid id
            expect(response.status).to.not.equal(200)
            //Assert that the Invalid first name is not updated
            expect(response.body.firstName).to.not.equal(InvalidUser.firstName)
            //Assert that the Invalid last name is not updated
            expect(response.body.lastName).to.not.equal(InvalidUser.lastName)
            //Assert that the Invalid dependent amount is not updated
            expect(response.body.dependants).to.not.equal(InvalidUser.dependants)
        
        })

    })
})