package com.eshop.service;
import java.util.Map;

import com.eshop.pojo.UserInfo;

public interface UserInfoService {
 int queryUser(Map<String,Object> map);
 UserInfo queryUserInfoByid(int id);
 UserInfo queryUserInfoByName(String userName);
}
