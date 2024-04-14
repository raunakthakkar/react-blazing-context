import React, { createContext, useRef, useSyncExternalStore } from 'react';

const useContextWithSubscribers = <T,>(obj:T): {
    get: (key?: string) => T,
    set: (data: Partial<T>) => void,
    sub: any

} => {
    const myData = useRef(obj);
    const subs = useRef([]);

    const get = (key = ''): T => {
        return myData.current?.[key] || myData.current;
    }
    const set = (data: Partial<T>) => {
        myData.current = { ...myData.current, ...data }
        subs.current.forEach((cb) => cb())
    }

    const sub = (cb: () => void) => {
        console.log(cb);
        subs.current.push(cb);
        return ()=>{subs.current.pop()};
    }

    return {
        get,
        set,
        sub,
    }
}

export const CreateFastContext = <T,>(data: T) => {
    const MyCont = createContext<unknown>(data)


    const useSubscribeToData = (key?: keyof T ) => {
        const { ...others } = useContextWithSubscribers(data);
        const myData = useSyncExternalStore(others.sub,others.get)
        return [(key ? myData[key]: myData), others.set] as const
    }

    const Provider = ({children}) => {
        const { ...others } = useContextWithSubscribers(data);
        return (
            <MyCont.Provider value={others}>
                {children}
            </MyCont.Provider>
        )
    }
    return {
        Provider,
        useSubscribeToData,
    }
}

export const myFormDataContext = CreateFastContext({ 'name': '', email: '', companyName: '', phoneNumber: '', acceptCondition: false, addrs: {} });

myFormDataContext.Provider
myFormDataContext.useSubscribeToData() // ts safe
