package com.eshop.service;
import java.util.List;
import java.util.Map;

import com.eshop.pojo.UserInfo;

public interface UserInfoService {
 int queryUser(Map<String,Object> map);
 UserInfo queryUserInfoByid(int id);
 UserInfo queryUserInfoByName(String userName);
 int saveUserInfo(Map<String,Object> map);
 List<UserInfo> queryUserInfoByStatus(int status);
 int updateUserInfo(UserInfo ui);
}
