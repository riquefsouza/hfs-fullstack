package br.com.hfs;

import java.io.Serializable;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class ApplicationUtil implements Serializable {

	private static final long serialVersionUID = 1L;

	public ApplicationUtil() {
		super();
	}

	public HttpSession getSession() {
	    ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
	    return attr.getRequest().getSession();		
	}

}
