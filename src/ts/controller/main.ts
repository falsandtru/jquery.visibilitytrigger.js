/// <reference path="../define.ts"/>
/// <reference path="_template.ts"/>

/* CONTROLLER */

module MODULE.CONTROLLER {

  export class Main extends Template implements ControllerInterface {

    constructor(private model_: ModelInterface) {
      super(model_, State.initiate);
      this.FUNCTIONS = new Functions();
      this.METHODS = new Methods();
      this.REGISTER(model_);
      FREEZE(this);
    }
    
    exec_($context: ExtensionInterface, setting: VTSetting): any[]
    exec_($context: ExtensionInterface, alias: string): any[]
    exec_($context: ExtensionInterface, window: Window): any[]
    exec_($context: ExtensionInterface, document: Document): any[]
    exec_($context: ExtensionInterface, element: HTMLElement): any[]
    exec_($context: ExtensionStaticInterface, option: any): any[]
    exec_($context: any): any[]{
      var args = [].slice.call(arguments, 1, 2),
          option = args[0];

      $context[DEF.NAME] = DEF.NAMESPACE[DEF.NAME];
      if (DEF.NAMESPACE[this.model_.alias()]) {
        $context[this.model_.alias()] = DEF.NAMESPACE[this.model_.alias()];
      }

      switch (typeof option) {
        case 'undefined':
        case 'string':
        case 'object':
          break;
        default:
          return $context;
      }

      if (option instanceof jQuery || this.model_.isDOM(option)) {
        return $context instanceof DEF.NAMESPACE ? $context.end().add(option)[DEF.NAME]()
                                                 : jQuery(option)[DEF.NAME]();
      }

      return [$context].concat(args);
    }

    view(context: JQuery, setting: SettingInterface): ViewInterface {
      var view = new View(this.model_, this);
      view.open(context, setting);
      return view;
    }

  }

  export class Singleton {

    constructor(model: ModelInterface = Model.singleton()) {
      Singleton.instance_ = Singleton.instance_ || new Main(model);
    }

    private static instance_: Main

    static singleton(): Main {
      return Singleton.instance_;
    }

    singleton(): Main {
      return Singleton.singleton();
    }

  }

}

module MODULE {
  export var Controller = CONTROLLER.Singleton
}
