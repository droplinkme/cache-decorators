import { IResource } from '@database/interfaces'
import { vi } from 'vitest'

export class VitestFakeResource implements IResource {
  public logger = vi.fn()
  public _client = vi.fn()
  public connect = vi.fn()
  public disconnect = vi.fn()
  public validateConnection = vi.fn()
}
