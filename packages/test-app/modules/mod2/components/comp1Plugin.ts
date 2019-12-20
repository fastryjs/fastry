import { ComponentPlugin } from "@fastry/ioc";

@ComponentPlugin("test-app/comp1/Component1")
export default class Component1Plugin {
  public beforeTestMethod() {
    // console.log("in PLUGIN!");
  }
}
