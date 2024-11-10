<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

<!--  <xsl:template match="/assemblies">-->
<!--    <xsl:variable name="tests" select="sum(assembly/@total)"/>-->
<!--    <xsl:variable name="time" select="format-number(sum(assembly/@time), '0.0000')"/>-->
<!--    <xsl:variable name="errors" select="sum(assembly/@errors)"/>-->
<!--    <xsl:variable name="failed" select="sum(assembly/@failed)"/>-->
<!--    <xsl:variable name="skipped" select="sum(assembly/@skipped)"/>-->
<!--    <testsuites tests="{$tests}" time="{$time}" errors="{$errors}" failures="{$failed}" skipped="{$skipped}">-->
<!--      <xsl:apply-templates/>-->
<!--    </testsuites>-->
<!--  </xsl:template>-->

<!--  <xsl:template match="assembly">-->
<!--      <xsl:apply-templates/>-->
<!--  </xsl:template>-->

  <xsl:template match="assemblies/assembly">
    <testsuites name="{@name}" classname="{@fullname}" tests="{@total}" time="{@time}" errors="{@errors}" failures="{@failed}" skipped="{@skipped}" timestamp="{@start-time}">
      <xsl:apply-templates/>
    </testsuites>
  </xsl:template>

  <xsl:template match="collection">
    <xsl:if test="test">
      <testsuite name="{replace(replace(@name, 'Test collection for ', ''),'TestSuite.','')}" tests="{@total}" time="{@time}" passed="{@passed}" failed="{@failed}" skipped="{@skipped}">
        <xsl:apply-templates select="test"/>
      </testsuite>
      <xsl:apply-templates select="collection"/>
    </xsl:if>
    <xsl:if test="not(test)">
      <xsl:apply-templates/>
    </xsl:if>
  </xsl:template>

  <xsl:template match="test">
    <testcase classname="{@type}" time="{@time}" status="{replace(replace(replace(@result,'Fail','Failed'),'Pass','Passed'),'Skip','Skipped')}">
      <xsl:choose>
        <xsl:when test="substring-after(@name, @type)=''">
          <xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="name"><xsl:value-of select="substring(substring-after(@name, @type), 2)"/></xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:if test="@result = 'Skip'">
        <xsl:choose>
          <xsl:when test="reason">
            <skipped message="{reason}"/>
          </xsl:when>
          <xsl:otherwise>
            <skipped/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:if test="@result = 'Fail'">
        <failure type="{failure/@exception-type}" message="{failure/message}">
          <xsl:value-of select="failure/stack-trace"/>
        </failure>
      </xsl:if>
      <xsl:apply-templates select="traits"/>
      <xsl:apply-templates select="output"/>
      <xsl:apply-templates select="test"/>
    </testcase>
  </xsl:template>

  <xsl:template match="output">
    <system-out>
      <xsl:value-of select="."/>
    </system-out>
  </xsl:template>

  <xsl:template match="traits">
    <xsl:if test="trait">
      <properties>
        <xsl:for-each select="trait">
          <property name="{@name}" value="{@value}"/>
        </xsl:for-each>
      </properties>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>

