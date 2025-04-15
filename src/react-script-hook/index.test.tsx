import { act, renderHook } from '@testing-library/react-hooks';

import useScript, { scripts } from './';

describe('useScript', () => {
    beforeEach(() => {
        const html = document.querySelector('html');
        if (html) {
            html.innerHTML = '';
        }
        // Reset scripts status
        Object.keys(scripts).forEach((key) => delete scripts[key]);
    });

    it('should append a script tag', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const { result } = renderHook(() =>
            useScript({ src: 'http://scriptsrc/' }),
        );

        const [loading, error] = result.current;

        expect(loading).toBe(true);
        expect(error).toBeNull();

        const script = document.querySelector('script');
        expect(script).not.toBeNull();
        if (script) {
            expect(script.getAttribute('src')).toEqual('http://scriptsrc/');
        }
    });

    it('should append a script tag with attributes', async () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const { result } = renderHook(() =>
            useScript({
                src: 'http://scriptsrc/',
                'data-test': 'test',
                async: true,
            }),
        );

        const [loading, error] = result.current;

        expect(loading).toBe(true);
        expect(error).toBeNull();

        const script = document.querySelector('script');
        expect(script).not.toBeNull();
        if (script) {
            expect(script.getAttribute('src')).toEqual('http://scriptsrc/');
            expect(script.getAttribute('data-test')).toEqual('test');
            expect(script.getAttribute('async')).toBe('true');
        }
    });

    it('should render a script only once, single hook', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const props = { src: 'http://scriptsrc/' };
        const handle = renderHook((p) => useScript(p), {
            initialProps: props,
        });
        expect(document.querySelectorAll('script').length).toBe(1);

        handle.rerender();
        expect(document.querySelectorAll('script').length).toBe(1);
    });

    it('should render a script only once, multiple hooks', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const props = { src: 'http://scriptsrc/' };
        const handle1 = renderHook((p) => useScript(p), {
            initialProps: props,
        });
        const handle2 = renderHook((p) => useScript(p), {
            initialProps: props,
        });

        expect(document.querySelectorAll('script').length).toBe(1);
        handle2.rerender();
        expect(document.querySelectorAll('script').length).toBe(1);
        handle1.rerender();
        expect(document.querySelectorAll('script').length).toBe(1);
        handle2.rerender();
        expect(document.querySelectorAll('script').length).toBe(1);
    });

    it('should render a script only once, multiple hooks in same component', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const props = { src: 'http://scriptsrc/' };
        const handle = renderHook(
            (p) => {
                useScript(p);
                useScript(p);
            },
            {
                initialProps: props,
            },
        );

        expect(document.querySelectorAll('script').length).toBe(1);
        handle.rerender();
        expect(document.querySelectorAll('script').length).toBe(1);
    });

    it('should set loading false on load', async () => {
        const props = { src: 'http://scriptsrc/' };
        const handle = renderHook((p) => useScript(p), {
            initialProps: props,
        });

        const [loading, error] = handle.result.current;
        expect(loading).toBe(true);
        expect(error).toBe(null);

        const el = document.querySelector('script');
        expect(el).toBeDefined();
        act(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            el!.dispatchEvent(new Event('load'));
        });

        const [loadingAfter, errorAfter] = handle.result.current;
        expect(loadingAfter).toBe(false);
        expect(errorAfter).toBe(null);
    });

    it('should set loading false on load, multiple hooks', async () => {
        const props = { src: 'http://scriptsrc/' };
        const handle1 = renderHook((p) => useScript(p), {
            initialProps: props,
        });
        const handle2 = renderHook((p) => useScript(p), {
            initialProps: props,
        });

        expect(handle1.result.current).toStrictEqual([true, null]);
        expect(handle2.result.current).toStrictEqual([true, null]);

        const el = document.querySelector('script');
        expect(el).toBeDefined();
        act(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            el!.dispatchEvent(new Event('load'));
        });

        expect(handle1.result.current).toStrictEqual([false, null]);
        expect(handle2.result.current).toStrictEqual([false, null]);
    });

    it('should set loading true if previously loaded', async () => {
        const props = { src: 'http://scriptsrc/' };
        const handle1 = renderHook((p) => useScript(p), {
            initialProps: props,
        });
        expect(handle1.result.current).toStrictEqual([true, null]);

        const el = document.querySelector('script');
        expect(el).toBeDefined();
        act(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            el!.dispatchEvent(new Event('load'));
        });
        expect(handle1.result.current).toStrictEqual([false, null]);

        const handle2 = renderHook((p) => useScript(p), {
            initialProps: props,
        });
        expect(handle2.result.current).toStrictEqual([false, null]);
    });

    it('should not cause issues on unmount', async () => {
        const props = { src: 'http://scriptsrc/' };
        const handle = renderHook((p) => useScript(p), {
            initialProps: props,
        });

        handle.unmount();

        act(() => {
            const el = document.querySelector('script');
            if (el) {
                el.dispatchEvent(new Event('load'));
            }
        });
    });

    it('should check for script existing on the page before rendering when checkForExisting is true', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const previousScript = document.createElement('script');
        previousScript.src = 'http://scriptsrc/';
        document.body.appendChild(previousScript);

        expect(document.querySelectorAll('script').length).toBe(1);

        const props = { src: 'http://scriptsrc/', checkForExisting: true };
        const handle = renderHook(
            (p) => {
                // Check that state is immediately "loaded"
                const result = useScript(p);
                expect(result).toStrictEqual([false, null]);
                return result;
            },
            {
                initialProps: props,
            },
        );
        expect(document.querySelectorAll('script').length).toBe(1);
        expect(handle.result.current).toStrictEqual([false, null]);

        handle.rerender();
        expect(document.querySelectorAll('script').length).toBe(1);
        expect(handle.result.current).toStrictEqual([false, null]);
    });

    it('should not check for script existing on the page before rendering when checkForExisting is not set', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const previousScript = document.createElement('script');
        previousScript.src = 'http://scriptsrc/';
        document.body.appendChild(previousScript);

        expect(document.querySelectorAll('script').length).toBe(1);

        const props = { src: 'http://scriptsrc/' };
        const handle = renderHook((p) => useScript(p), {
            initialProps: props,
        });
        expect(document.querySelectorAll('script').length).toBe(2);

        handle.rerender();
        expect(document.querySelectorAll('script').length).toBe(2);
    });

    it('should handle null src and not append a script tag', () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const { result } = renderHook(() => useScript({ src: null }));

        const [loading, error] = result.current;

        expect(loading).toBe(false);
        expect(error).toBeNull();

        expect(document.querySelectorAll('script').length).toBe(0);
    });

    it('should append script after src change from null', async () => {
        expect(document.querySelectorAll('script').length).toBe(0);

        const props = { src: null };
        const { result, rerender, waitFor } = renderHook((p) => useScript(p), {
            initialProps: props,
        });

        const [loading, error] = result.current;

        expect(loading).toBe(false);
        expect(error).toBeNull();

        expect(document.querySelectorAll('script').length).toBe(0);

        props.src = 'http://scriptsrc/' as any;
        rerender(props);
        await waitFor(() => {
            expect(document.querySelectorAll('script').length).toBe(1);
        });
    });

    it('should remove script from DOM and scripts cache when unmounted during loading', () => {
        expect(document.querySelectorAll('script').length).toBe(0);
        expect(Object.keys(scripts).length).toBe(0);
        
        const testSrc = 'http://scriptsrc/test';
        const { unmount } = renderHook(() => useScript({ src: testSrc }));
        
        // Verify script was added
        expect(document.querySelectorAll('script').length).toBe(1);
        expect(Object.keys(scripts).length).toBe(1);
        expect(scripts[testSrc]).toBeDefined();
        expect(scripts[testSrc].loading).toBe(true);
        
        // Unmount the component while script is still loading (before load event)
        unmount();
        
        // Verify script was removed from DOM and cache
        expect(document.querySelectorAll('script').length).toBe(0);
        expect(Object.keys(scripts).length).toBe(0);
        expect(scripts[testSrc]).toBeUndefined();
    });
});