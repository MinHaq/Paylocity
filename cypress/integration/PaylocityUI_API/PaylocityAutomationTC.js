/// <reference types="cypress" />
import LoginPage from '../../support/pageObjectsPLC/LoginPage'
import HomePage from '../../support/pageObjectsPLC/HomePage'


describe("Paylocity UI", function(){
    
        beforeEach(() => {
            
            cy.fixture("paylocityUI").then(function(data){
                
                this.data=data
            })

            cy.visit("https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login")
        })

       
        it("Verify that user is able to successfully login with the correct credentials", function(){
            const loginPage= new LoginPage()
            const homePage= new HomePage()
            
            
            
            
            loginPage.getUserName().type(this.data.username)
            loginPage.getPassword().type(this.data.password)
            loginPage.getLoginButton().click() 

            //Assert employee table is visible
            homePage.getEmployeeTable().should("be.visible")

            //Assert Log out button is visible
            homePage.getLogOutButton().should("be.visible")

            //Assert that the add employee button is visible
            homePage.getAddButton().should("be.visible")


            homePage.getLogOutButton().click()

        }) 
        

        it("Verify user is unable to login with incorrect credentials", function(){
           
            const loginPage= new LoginPage()
            
            //Entering incorrect usn and password leads to  what appears to be a development environment issue
            loginPage.getUserName().type(this.data.incorrectUsername)
            loginPage.getPassword().type(this.data.incorrectPassword)
            loginPage.getLoginButton().click() 
            //Put the checkpoint at the username should be visible because the development error page is a iframe
            //iframe requires a nodejs package- so it may not run
            loginPage.getUserName().should("be.visible")

        }) 
        it("Verify user can add 2 or more Employees with 2 or more dependents", function(){
            const loginPage= new LoginPage()
            const homePage= new HomePage()
            
            loginPage.getUserName().type(this.data.username)
            loginPage.getPassword().type(this.data.password)
            loginPage.getLoginButton().click() 

            

            for(let i=0; i<this.data.firstName.length; i++) {
                homePage.getAddButton().click()
                homePage.getFirstName().type(this.data.firstName[i])
                homePage.getLastName().type(this.data.lastName[i])
                homePage.getDependents().type(this.data.dependents[i])
                homePage.clickAddEmployeeButton().click()              
            }   
            
            //This will loop through rows and retrive the column correspoding to each rows
            //It will provide the user with the contents of everything in the table
            cy.get("tbody tr").each(($row) =>{
                cy.wrap($row).within(()=>{
                    cy.get("td").each(($col)=>{
                        //Loop through the data
                        for(let i=0; i<this.data.firstName.length; i++) {
                            if($col.text()==this.data.firstName[i]) {
                                //Assert that first name is correctly added to the table
                                homePage.getTableData().eq(1).should("have.text",this.data.firstName[i])
                                //Assert that second name is correctly added to the table
                                homePage.getTableData().eq(2).should("have.text",this.data.lastName[i])
                                //Assert that dependents are correctly reflected
                                homePage.getTableData().eq(3).should("have.text",this.data.dependents[i])
                         }
                             
                         }         
                                                
                    })
                })
            })

            homePage.getLogOutButton().click()

        })

        

        it("Verify that the user is able to update an employee", function(){ 
            const loginPage= new LoginPage()
            const homePage= new HomePage()
            
            loginPage.getUserName().type(this.data.username)
            loginPage.getPassword().type(this.data.password)
            loginPage.getLoginButton().click() 

            homePage.clickEditButtonHP().should("be.visible").click()

            
            homePage.getFirstName().clear().type(this.data.updateFirstName)
            homePage.getLastName().clear().type(this.data.updatelastName)
            homePage.getDependents().clear().type(this.data.updatedependents)
            cy.get("#updateEmployee").click()

             //This will loop through rows and retrive the column correspoding to each rows
            //It will provide the user with the contents of everything in the table
            cy.get("tbody tr").each(($row) =>{
                cy.wrap($row).within(()=>{
                    cy.get("td").each(($col)=>{
                            if($col.text()==this.data.updateFirstName) {
                                //Assert that first name is correctly updated on the table
                                homePage.getTableData().eq(1).should("have.text",this.data.updateFirstName)
                                //Assert that second name is correctly updated on the table
                                homePage.getTableData().eq(2).should("have.text",this.data.updatelastName)
                                //Assert that dependents are correctly updated on the table
                                homePage.getTableData().eq(3).should("have.text",this.data.updatedependents)

                                
                         }
                             
                                  
                                                
                    })
                })
            })

            homePage.getLogOutButton().click()
            
        }) 
        
        it("Verify that a deleted user no longer appears on the table", function(){
            const loginPage= new LoginPage()
            const homePage= new HomePage()

            loginPage.getUserName().type(this.data.username)
            loginPage.getPassword().type(this.data.password)
            loginPage.getLoginButton().click() 


            cy.get(".fa-times").as("editButton") 
            cy.get('#deleteEmployee').as("deleteButton") 

            cy.get("tbody tr").each(($row) =>{
                cy.wrap($row).within(()=>{
                    cy.get("td").each(($col)=>{
                            if($col.text()==this.data.updateFirstName) {
                                
                                
                              
                                cy.get('.fa-times').click()
                                cy.get('@deleteButton').click()
                         }
                             
                                  
                                                
                    })
                })
            })

            cy.get("tbody tr").within(function(){
                //Assert that the last name is not found
                cy.get("td").eq(1).should("not.contain.text",this.data.updatelastName)
                //Assert that the firstName name is not found
                cy.get("td").eq(2).should("not.contain.text",this.data.updateFirstName)
                
            })


            homePage.getLogOutButton().click()
            
            
        })
        
    })