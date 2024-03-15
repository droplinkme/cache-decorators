export class NoCacheRepositoryExceptions extends Error {
  public status = 404;
  constructor(message = 'Repository cache was not instantiated') {
    super(message)
  }
}