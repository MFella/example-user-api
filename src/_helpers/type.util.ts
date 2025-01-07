export class TypeUtil {
  static isErrorWithMessage(
    error: unknown,
  ): error is Record<'message', string> {
    return typeof error === 'object' && 'message' in error;
  }
}
