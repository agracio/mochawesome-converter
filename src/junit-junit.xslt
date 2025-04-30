<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <xsl:choose>
            <xsl:when test="testsuites">
                <testsuites name="{@name}" classname="{@classname}">
                    <xsl:choose>
                        <xsl:when test="@tests">
                            <xsl:attribute name="tests"><xsl:value-of select="@tests"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="tests"><xsl:value-of select="sum(testsuite/@tests)" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="@errors">
                            <xsl:attribute name="errors"><xsl:value-of select="@errors"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="errors"><xsl:value-of select="sum(testsuite/@errors)" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="@failures">
                            <xsl:attribute name="failures"><xsl:value-of select="@failures"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="failures"><xsl:value-of select="sum(testsuite/@failures)" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="@skipped">
                            <xsl:attribute name="skipped"><xsl:value-of select="@skipped"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="skipped"><xsl:value-of select="sum(testsuite/@skipped)" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="@disabled">
                            <xsl:attribute name="disabled"><xsl:value-of select="@disabled"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="disabled"><xsl:value-of select="sum(testsuite/@disabled)" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="@assertions">
                            <xsl:attribute name="assertions"><xsl:value-of select="@assertions"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="assertions"><xsl:value-of select="sum(testsuite/@assertions)" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="@time">
                            <xsl:attribute name="time"><xsl:value-of select="@time"/></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="time"><xsl:value-of select="format-number(sum(testsuite/@time),'#.00000000')" /></xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>

                    <xsl:apply-templates/>

                </testsuites>
            </xsl:when>
            <xsl:otherwise>
                <testsuites tests="{@tests}" errors="{@errors}" failures="{@failures}" skipped="{@skipped}" disabled="{@disabled}" assertions="{@assertions}" time="{@time}">
                    <testsuite name="{replace(@name, 'Root Suite.', '')}" classname="{replace(@classname, 'Root Suite.', '')}" file="{@file}" tests="{@tests}" errors="{@errors}" failures="{@failures}" skipped="{@skipped}" disabled="{@disabled}" assertions="{@assertions}" time="{@time}" timestamp="{@timestamp}" hostname="{@hostname}" id="{@id}" package="{@package}">
                        <xsl:apply-templates/>
                    </testsuite>
                </testsuites>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template match="testsuite">
        <xsl:if test="testcase">
            <testsuite name="{replace(@name, 'Root Suite.', '')}" classname="{replace(@classname, 'Root Suite.', '')}" tests="{@tests}" file="{@file}" time="{@time}" passed="{@passed}" failures="{@failures}" errors="{@errors}" skipped="{@skipped}" disabled="{@disabled}" timestamp="{@timestamp}">
                <xsl:apply-templates select="testcase"/>
                <xsl:apply-templates select="properties"/>
                <xsl:apply-templates select="system-out"/>
                <xsl:apply-templates select="system-err"/>
            </testsuite>
            <xsl:apply-templates select="testsuite"/>
        </xsl:if>
        <xsl:if test="not(testcase)">
            <xsl:apply-templates select="testsuite"/>
        </xsl:if>
    </xsl:template>

    <xsl:template match="testcase">
        <testcase name="{@name}" classname="{@classname}" file="{@file}" time="{@time}" status="{@status}">
            <xsl:if test="skipped">
                <xsl:choose>
                    <xsl:when test="message">
                        <skipped message="{message}"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <skipped/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:if>
            <xsl:if test="failure">
                <failure type="{failure/@type}" message="{failure/@message}">
                    <xsl:value-of select="failure"/>
                </failure>
            </xsl:if>
            <xsl:if test="error">
                <error type="{error/@type}" message="{error/@message}">
                    <xsl:value-of select="error"/>
                </error>
            </xsl:if>
            <xsl:apply-templates select="properties"/>
            <xsl:apply-templates select="system-out"/>
            <xsl:apply-templates select="system-err"/>
            <xsl:apply-templates select="testcase"/>
        </testcase>
    </xsl:template>


    <xsl:template match="system-out">
        <system-out>
            <xsl:value-of select="."/>
        </system-out>
    </xsl:template>

    <xsl:template match="system-err">
        <system-err>
            <xsl:value-of select="."/>
        </system-err>
    </xsl:template>

    <xsl:template match="properties">
        <xsl:if test="property">
            <properties>
                <xsl:for-each select="property">
                    <property name="{@name}" value="{@value}"/>
                </xsl:for-each>
            </properties>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>