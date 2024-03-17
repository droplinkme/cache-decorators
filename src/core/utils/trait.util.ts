type Constructor = new (...a: any[]) => any;
type Merge<TTrait extends Constructor, TTarget extends Constructor> =
  (new (...a: ConstructorParameters<TTarget>) => InstanceType<TTrait> & InstanceType<TTarget>) & Pick<TTarget, keyof TTarget> & Pick<TTrait, keyof TTrait>

export const Trait = <TTrait extends Constructor>(Orig: TTrait) =>
  <TTarget extends Constructor>(Tgt: TTarget): Merge<TTrait, TTarget> => {
    // perform patching 
    return Tgt as any; // assertion required
  }