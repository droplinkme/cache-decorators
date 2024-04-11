import { IResource } from "../interfaces"

export class JestFakeResource implements IResource {
  public logger = jest.fn()
  public _client = jest.fn()
  public connect = jest.fn()
  public disconnect = jest.fn()
  public validateConnection = jest.fn()
}
