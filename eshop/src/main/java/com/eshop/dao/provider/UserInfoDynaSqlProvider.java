package com.eshop.dao.provider;
import java.util.Map;

import org.apache.ibatis.jdbc.SQL;
import com.eshop.pojo.UserInfo;

public class UserInfoDynaSqlProvider {
	public String updateUserInfo(UserInfo ui) {
		return new SQL() {
			{
				UPDATE("user_info");
				if(ui.getUserName() != null) {
					SET("userName = #{userName}");
				}
				if(ui.getAddress() !=null) {
					SET("address = #{address}");
				}
				if(ui.getCompany() !=null) {
					SET("company = #{company}");
				}
				if(ui.getDepartmentname()!=null) {
					SET("departmentname = #{departmentname}");
				}
				if(ui.getEmail()!=null) {
					SET("email = #{email}");
				}
				if(ui.getMobilephone() !=null) {
					SET("mobilephone = #{mobilephone}");
				}
				if(ui.getPassword() !=null) {
					SET("password = #{password}");
				}
				if(ui.getPost() !=null) {
					SET("post = #{post}");
				}
				if(ui.getRealName() !=null) {
					SET("realName = #{realName}");
				}
				if(ui.getSex() !=null) {
					SET("sex = #{sex}");
				}
				if(ui.getStatus()>0) {
					SET("status =#{status}");
				}
				WHERE("id = #{id}");
			}
		}.toString();
	}
	
	public String queryByPage(Map<String, Object> params){
		String sql = new SQL() {
			{
				SELECT("*");
				FROM("user_info");
				if(params.get("userInfo")!=null) {
				UserInfo userInfo =(UserInfo)params.get("userInfo");
				if(userInfo.getUserName()!=null) {
					WHERE("userName like CONCAT(CONCAT('%', #{userInfo.userName}),'%') ");
				}
				if(userInfo.getRealName()!=null) {
					WHERE("realName like CONCAT(CONCAT('%', #{userInfo.realName}),'%') ");
				}
				if(userInfo.getDepartmentname()!=null) {
					WHERE("departmentname like CONCAT(CONCAT('%', #{userInfo.departmentname}),'%') ");
				}
				if(userInfo.getCompany()!=null) {
					WHERE("company like CONCAT(CONCAT('%', #{userInfo.company}),'%') ");
				}
				WHERE("status = #{userInfo.status}");
				}
			}
		}.toString();
		if(params.get("sort") !=null) {
			sql +=" order by gmt_create ${sort} ";
		}
		if (params.get("pager") != null) {
			sql += " limit #{pager.firstLimitParam} , #{pager.perPageRows}  ";
		}
		System.out.println("after:sql="+sql);
		return sql;
	}
	
	//条件查询用户总数
	public String count(Map<String, Object> params) {
		return new SQL() {
			{
				SELECT("count(*)");
				FROM("user_info");
				
	                 if (params.get("userInfo") != null) { 
					
					 UserInfo userInfo = (UserInfo)params.get("userInfo");
					 if(userInfo.getUserName()!=null) {
					 WHERE("userName like CONCAT(CONCAT('%', #{userInfo.userName}),'%') "); }
					 if(userInfo.getRealName()!=null) {
					  WHERE("realName like CONCAT(CONCAT('%', #{userInfo.realName}),'%') "); }
					 if(userInfo.getDepartmentname()!=null) {
					 WHERE("departmentname like CONCAT(CONCAT('%', #{userInfo.departmentname}),'%') "); } 
					 if(userInfo.getCompany()!=null) {
					 WHERE("company like CONCAT(CONCAT('%', #{userInfo.company}),'%') "); }
				       WHERE("status = #{userInfo.status}");
				  }
				 
			}
		}.toString();
	}

}

