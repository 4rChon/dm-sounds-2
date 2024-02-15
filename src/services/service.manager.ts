export class ServiceManager {
  private static services: Map<new (...args: any[]) => any, any> = new Map();

  public static register<T>(ctor: new (...args: any[]) => T): void {
    if (!this.services.has(ctor)) {
      this.services.set(ctor, new ctor());
    }
  }

  public static get<T>(ctor: new () => T): T {
    const service = this.services.get(ctor);
    if (!service) {
      throw new Error("Service not registered");
    }

    return service;
  }
}

export function RegisterService(): ClassDecorator {
  return (target: any) => {
    ServiceManager.register(target);
  }
}