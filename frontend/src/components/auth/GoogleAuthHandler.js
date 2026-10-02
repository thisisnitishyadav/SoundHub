'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { getUser } from '@/redux/slices/auth';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=0; path=/;';
}

export default function GoogleAuthHandler() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getCookie('authCookie');
    if (token) {
      localStorage.setItem('accessToken', token);
      deleteCookie('authCookie');
      dispatch(getUser());
      router.push('/myAccount');
    }
  }, [dispatch, router]);

  return null;
}
