/**
 * Copyright (c) 2000-2012 Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.portal.security.auth;

import com.liferay.portal.kernel.uuid.PortalUUIDUtil;

import java.util.Collections;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;

/**
 * @author Shuyang Zhou
 */
public class TransientTokenUtil {

	public static boolean checkToken(String token) {
		long currentTime = System.currentTimeMillis();

		expungeExpiredToken(currentTime);

		Set<Map.Entry<Long, String>> tokens = _tokens.entrySet();

		Iterator<Map.Entry<Long, String>> itr = tokens.iterator();

		while (itr.hasNext()) {
			Map.Entry<Long, String> entry = itr.next();

			String curToken = entry.getValue();

			if (token.equals(curToken)) {
				itr.remove();

				return true;
			}
		}

		return false;
	}

	public static void clearAll() {
		_tokens.clear();
	}

	public static String createToken(long timeTolive) {
		long currentTime = System.currentTimeMillis();

		long expireTime = currentTime + timeTolive;

		expungeExpiredToken(currentTime);

		String token = PortalUUIDUtil.generate();

		_tokens.put(expireTime, token);

		return token;
	}

	private static void expungeExpiredToken(long currentTime) {
		SortedMap<Long, String> headMap = _tokens.headMap(currentTime);

		headMap.clear();
	}

	private static final SortedMap<Long, String> _tokens =
		Collections.synchronizedSortedMap(new TreeMap<Long, String>());

}