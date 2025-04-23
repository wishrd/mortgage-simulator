export type OptionalId<T extends { id: unknown }> = Omit<T, 'id'> & { id?: T['id'] };
