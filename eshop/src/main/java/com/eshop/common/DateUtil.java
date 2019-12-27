package com.eshop.common;
import java.text.SimpleDateFormat;
import java.util.Date;


public class DateUtil {

	//返回字符串形式的当前日期
	public static String getCurrentDateStr(String pattern) {
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		String currentDateStr = format.format(new Date());
		return currentDateStr;
	}
}
