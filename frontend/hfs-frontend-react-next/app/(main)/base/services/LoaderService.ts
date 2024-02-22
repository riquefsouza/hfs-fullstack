import { BehaviorSubject } from "rxjs";

export class LoaderService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}
}
