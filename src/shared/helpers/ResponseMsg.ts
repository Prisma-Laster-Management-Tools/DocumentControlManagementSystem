export class ResponseMsg {
  public static success(data?: any) {
    return { success: true, data };
  }
}
