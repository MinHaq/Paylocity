class HomePage
{

    getEmployeeTable() {
        
        return cy.get("#employeesTable")
    }
    getLogOutButton() {
        return cy.contains("Log Out")
    }
    getAddButton(){
        return cy.get("#add")
    }

    getFirstName() {
        return cy.get("#firstName")
    }

    getLastName() {
        return cy.get("#lastName")
    }

    getDependents() {
        return cy.get("#dependants")
    }

    clickAddEmployeeButton() {
        return cy.get("#addEmployee")
    }

    getTableData() {
        return cy.get("td")
    }

    clickEditButtonHP(){
        return cy.get(":nth-child(1) > :nth-child(9) > .fa-edit")
    }

    clickUpdateButton() {
        cy.get("#updateEmployee")
    }
   
}

export default HomePage