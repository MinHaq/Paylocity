class LoginPage
{
    getUserName() {
        return cy.get("#Username")
    }
    
    getPassword() {
        return cy.get("#Password")
    }

    getLoginButton() {
        return cy.contains("Log In")
    }

}
export default LoginPage