namespace SetTimeoutSample {
    "use strict";

    class MyClass {
        private onAnimationEnd(): Function {
            return () => {};
        }

        private method(): void {
            setTimeout(this.onAnimationEnd(), 300);
        }
    }
}
