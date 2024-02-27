import { TestBed } from "@angular/core/testing";
import { DefaultInterceptor } from "./default.interceptor";

describe("DefaultInterceptor", () => {
  let service: DefaultInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultInterceptor);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
