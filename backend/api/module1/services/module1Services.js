function myService() {
    console.log("Executing myService()");
    framework.functions.module1Functions.myFunction1()
}

module.exports = {
    myService: myService
};