/**
 * Date utility class
 *
 * The intent of this class is to provide better control over the expiration times of
 * tokens which is especially useful for testing.
 */
class DateUtils {
    static ONE_MINUTE_IN_MS = 60 * 1000;

    public static getCurrentDateTime(): Date {
        return new Date();
    }

    public static getDateMinutesFromNow(minutes: number): Date {
        return new Date(Date.now() + minutes * DateUtils.ONE_MINUTE_IN_MS);
    }
}

export default DateUtils;
